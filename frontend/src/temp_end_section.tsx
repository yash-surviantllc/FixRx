        {/* Preview Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 
              className="text-[18px] font-bold mb-4"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Preview Controls
            </h3>
            
            <button
              onClick={handleSendTest}
              className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
            >
              <Eye size={20} color="#6B7280" />
              <span 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Send test message to my phone
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleSendInvitations}
          className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center space-x-3"
          style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
            boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
          }}
        >
          <Send size={20} color="white" />
          <span 
            className="text-white text-[16px] font-medium"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
          >
            Send {activeContacts.length} invitation{activeContacts.length === 1 ? '' : 's'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}