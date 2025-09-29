import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, Mail, MessageSquare, Send, Loader2, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/app.store';
import { InvitationService } from '../services/invitation.service';
import { ContactService } from '../services/contact.service';
import type { Contact, SendInvitationRequest, BulkInvitationRequest } from '../types/api';
import { InvitationType } from '../types/api';

interface IntegratedInvitationScreenProps {
  onBack: () => void;
  onInvitationSent: () => void;
  invitationType: 'contractors' | 'friends';
}

interface InvitationData {
  type: InvitationType;
  message: string;
  recipients: Array<{
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    isContact: boolean;
  }>;
}

export function IntegratedInvitationScreen({ 
  onBack, 
  onInvitationSent, 
  invitationType 
}: IntegratedInvitationScreenProps) {
  const { user } = useAuth();
  const { 
    contacts, 
    setContacts, 
    selectedContacts, 
    setSelectedContacts,
    isLoading, 
    setLoading, 
    error, 
    setError, 
    clearError 
  } = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [invitationData, setInvitationData] = useState<InvitationData>({
    type: InvitationType.EMAIL,
    message: '',
    recipients: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '', phone: '' });
  const [isSending, setIsSending] = useState(false);
  const [sentResults, setSentResults] = useState<any>(null);

  useEffect(() => {
    loadContacts();
    setDefaultMessage();
  }, [invitationType]);

  useEffect(() => {
    // Update recipients when selected contacts change
    const recipients = selectedContacts.map(contact => ({
      id: contact.id,
      name: contact.displayName || `${contact.firstName} ${contact.lastName}`,
      email: contact.email,
      phone: contact.phone,
      isContact: true,
    }));
    setInvitationData(prev => ({ ...prev, recipients }));
  }, [selectedContacts]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await ContactService.getContacts(1, 100);
      setContacts(response.contacts);
    } catch (err: any) {
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMessage = () => {
    const userName = user ? `${user.firstName} ${user.lastName}` : 'A friend';
    
    const defaultMessages = {
      contractors: `Hi! ${userName} invited you to join FixRx - a platform that connects homeowners with trusted contractors. Sign up to showcase your services and connect with potential clients in your area.`,
      friends: `Hey! ${userName} is using FixRx to find and manage home services. It's been really helpful! You should check it out - it makes finding trusted contractors so much easier.`
    };

    setInvitationData(prev => ({
      ...prev,
      message: defaultMessages[invitationType],
    }));
  };

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    const name = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = contact.email?.toLowerCase() || '';
    const phone = contact.phone.toLowerCase();
    
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  const handleContactToggle = (contact: Contact) => {
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    
    if (isSelected) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleAddNewRecipient = () => {
    if (!newRecipient.name.trim()) return;
    
    const recipient = {
      name: newRecipient.name.trim(),
      email: newRecipient.email.trim() || undefined,
      phone: newRecipient.phone.trim() || undefined,
      isContact: false,
    };

    setInvitationData(prev => ({
      ...prev,
      recipients: [...prev.recipients, recipient],
    }));

    setNewRecipient({ name: '', email: '', phone: '' });
  };

  const handleRemoveRecipient = (index: number) => {
    const recipient = invitationData.recipients[index];
    
    if (recipient.isContact && recipient.id) {
      // Remove from selected contacts
      setSelectedContacts(selectedContacts.filter(c => c.id !== recipient.id));
    } else {
      // Remove from recipients list
      setInvitationData(prev => ({
        ...prev,
        recipients: prev.recipients.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSendInvitations = async () => {
    try {
      setIsSending(true);
      clearError();

      if (invitationData.recipients.length === 1) {
        // Send single invitation
        const recipient = invitationData.recipients[0];
        const request: SendInvitationRequest = {
          type: invitationData.type,
          recipientEmail: recipient.email,
          recipientPhone: recipient.phone,
          message: invitationData.message.trim(),
        };

        await InvitationService.sendInvitation(request);
        setSentResults({ sent: 1, failed: 0, errors: [] });
      } else {
        // Send bulk invitations
        const request: BulkInvitationRequest = {
          type: invitationData.type,
          recipients: invitationData.recipients.map(r => ({
            name: r.name,
            email: r.email,
            phone: r.phone,
          })),
          message: invitationData.message.trim(),
        };

        const results = await InvitationService.sendBulkInvitations(request);
        setSentResults(results);
      }

      setCurrentStep(4); // Success step
    } catch (err: any) {
      setError(err.message || 'Failed to send invitations');
    } finally {
      setIsSending(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return invitationData.recipients.length > 0;
      case 2:
        return invitationData.message.trim().length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          Invite {invitationType === 'contractors' ? 'Contractors' : 'Friends'}
        </h1>
        <div className="w-10" />
      </div>

      {/* Progress Indicator */}
      {currentStep < 4 && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Step {currentStep} of 3: {
                currentStep === 1 ? 'Select Recipients' :
                currentStep === 2 ? 'Customize Message' :
                'Review & Send'
              }
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={clearError}
            className="text-red-600 text-xs underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {invitationType === 'contractors' ? (
                  <UserPlus className="w-8 h-8 text-blue-600" />
                ) : (
                  <Users className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select {invitationType === 'contractors' ? 'Contractors' : 'Friends'}
              </h2>
              <p className="text-gray-600">
                Choose who you'd like to invite to FixRx
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Add New Recipient */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Add New Recipient</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Name *"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={newRecipient.email}
                    onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    value={newRecipient.phone}
                    onChange={(e) => setNewRecipient(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleAddNewRecipient}
                  disabled={!newRecipient.name.trim()}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Recipient
                </button>
              </div>
            </div>

            {/* Contacts List */}
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Loading contacts...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContacts.some(c => c.id === contact.id);
                  return (
                    <motion.div
                      key={contact.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleContactToggle(contact)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {contact.displayName || `${contact.firstName} ${contact.lastName}`}
                          </h3>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                          {contact.email && (
                            <p className="text-sm text-gray-500">{contact.email}</p>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Selected Recipients Summary */}
            {invitationData.recipients.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Selected Recipients ({invitationData.recipients.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {invitationData.recipients.map((recipient, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center bg-white px-3 py-1 rounded-full text-sm"
                    >
                      <span>{recipient.name}</span>
                      <button
                        onClick={() => handleRemoveRecipient(index)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Message</h2>
              <p className="text-gray-600">
                Personalize your invitation message
              </p>
            </div>

            {/* Invitation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setInvitationData(prev => ({ ...prev, type: InvitationType.EMAIL }))}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    invitationData.type === InvitationType.EMAIL
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Mail className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Email</span>
                </button>
                <button
                  onClick={() => setInvitationData(prev => ({ ...prev, type: InvitationType.SMS }))}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    invitationData.type === InvitationType.SMS
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">SMS</span>
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation Message
              </label>
              <textarea
                value={invitationData.message}
                onChange={(e) => setInvitationData(prev => ({ ...prev, message: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your invitation message..."
              />
              <p className="text-sm text-gray-500 mt-2">
                {invitationData.message.length} characters
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Send</h2>
              <p className="text-gray-600">
                Review your invitation before sending
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Recipients</h3>
                <p className="text-gray-600">
                  {invitationData.recipients.length} {invitationData.recipients.length === 1 ? 'person' : 'people'}
                </p>
                <div className="mt-2 space-y-1">
                  {invitationData.recipients.slice(0, 3).map((recipient, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      {recipient.name} {recipient.email && `(${recipient.email})`}
                    </p>
                  ))}
                  {invitationData.recipients.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{invitationData.recipients.length - 3} more
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Method</h3>
                <p className="text-gray-600 capitalize">{invitationData.type.toLowerCase()}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                <p className="text-gray-600 text-sm">{invitationData.message}</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invitations Sent!</h2>
            
            {sentResults && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-green-800 font-medium">
                  {sentResults.sent} invitation{sentResults.sent !== 1 ? 's' : ''} sent successfully
                </p>
                {sentResults.failed > 0 && (
                  <p className="text-red-600 text-sm mt-1">
                    {sentResults.failed} failed to send
                  </p>
                )}
              </div>
            )}

            <p className="text-gray-600 mb-8">
              Your invitations have been sent. Recipients will receive a message with a link to join FixRx.
            </p>

            <button
              onClick={onInvitationSent}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
          <div className="flex space-x-4">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  isStepValid(currentStep)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSendInvitations}
                disabled={isSending || !isStepValid(1) || !isStepValid(2)}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  !isSending && isStepValid(1) && isStepValid(2)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending...
                  </div>
                ) : (
                  'Send Invitations'
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom padding for fixed button */}
      {currentStep < 4 && <div className="h-24"></div>}
    </div>
  );
}
