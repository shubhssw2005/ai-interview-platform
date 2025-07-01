const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables with fallbacks
const TAVUS_API_KEY = process.env.TAVUS_API_KEY || '22a6c07483e14095b8576cd1bf6dabce';
const TAVUS_BASE_URL = process.env.TAVUS_BASE_URL || 'https://tavusapi.com';
const PERSONA_ID = process.env.TAVUS_PERSONA_ID || 'p760a9e07b91';
const REPLICA_ID = process.env.TAVUS_REPLICA_ID || 'rb17cf590e15';

// Mask sensitive info for logs
function mask(str) {
  if (!str) return '';
  return str.length <= 6 ? '***' : str.slice(0, 2) + '***' + str.slice(-2);
}

// Validate required environment variables
if (!TAVUS_API_KEY || !PERSONA_ID || !REPLICA_ID) {
  console.error('Error: Missing required environment variables');
  console.error('Required: TAVUS_API_KEY, TAVUS_PERSONA_ID, TAVUS_REPLICA_ID');
  process.exit(1);
}

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://interviewos.netlify.app',
  'https://interviewos.onrender.com',
  // Add your custom domain below if you have one:
  // 'https://your-custom-domain.com'
];

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS request from:', origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
// app.use(express.static('dist'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from the React app (dist folder)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all handler to serve index.html for any route not handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Create a conversation
async function createConversation(personaId, replicaId, conversationalContext = '') {
  const conversationData = {
    persona_id: personaId,
    replica_id: replicaId,
    conversation_name: "AI Interview Experience",
    conversational_context: conversationalContext || 'You are a professional AI interviewer. Conduct a friendly but professional interview, asking about the candidate\'s background, experience, and career goals. Keep the conversation natural and engaging. Ask follow-up questions based on their responses.',
    properties: {
      max_call_duration: 1800, // 30 minutes
      participant_left_timeout: 120, // 2 minutes
      enable_recording: false,
      language: "English"
    }
  };

  try {
    // Mask persona_id and replica_id in logs
    const logData = { ...conversationData, persona_id: mask(personaId), replica_id: mask(replicaId) };
    console.log('Creating conversation with data:', JSON.stringify(logData, null, 2));
    
    const response = await fetch(`${TAVUS_BASE_URL}/v2/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY
      },
      body: JSON.stringify(conversationData)
    });

    const responseText = await response.text();
    console.log('Tavus API response status:', response.status);
    // Do not log sensitive info in response
    console.log('Tavus API response:', response.status === 200 ? '[OK]' : responseText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    // Mask persona_id and replica_id in error logs
    console.error('Error creating conversation:', error.message.replace(personaId, mask(personaId)).replace(replicaId, mask(replicaId)));
    throw error;
  }
}

// Get conversation details
async function getConversation(conversationId) {
  try {
    const response = await fetch(`${TAVUS_BASE_URL}/v2/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
}

// End conversation
async function endConversation(conversationId) {
  try {
    const response = await fetch(`${TAVUS_BASE_URL}/v2/conversations/${conversationId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error ending conversation:', error);
    throw error;
  }
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    tavus_configured: !!TAVUS_API_KEY
  });
});

// Create conversation endpoint
app.post('/api/create-conversation', async (req, res) => {
  try {
    const { context } = req.body;
    
    // Validate input
    if (context && typeof context !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid context parameter. Must be a string.' 
      });
    }

    console.log('Creating conversation with context:', context);
    const conversation = await createConversation(PERSONA_ID, REPLICA_ID, context || '');
    
    if (conversation.conversation_url) {
      res.json({ 
        conversation_url: conversation.conversation_url,
        conversation_id: conversation.conversation_id,
        status: conversation.status || 'created'
      });
    } else {
      console.error('No conversation_url in response:', conversation);
      res.status(500).json({ 
        error: 'Failed to create conversation - no URL returned', 
        details: conversation 
      });
    }
  } catch (error) {
    console.error('Error in create-conversation endpoint:', error);
    
    // Handle specific error types
    if (error.message.includes('HTTP 401')) {
      res.status(401).json({ 
        error: 'Invalid API key', 
        details: 'Check your Tavus API key' 
      });
    } else if (error.message.includes('HTTP 404')) {
      res.status(404).json({ 
        error: 'Resource not found', 
        details: 'Check your persona_id and replica_id' 
      });
    } else if (error.message.includes('HTTP 429')) {
      res.status(429).json({ 
        error: 'Rate limit exceeded', 
        details: 'Please wait before creating another conversation' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create conversation', 
        details: error.message 
      });
    }
  }
});

// Get conversation details endpoint
app.get('/api/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    const conversation = await getConversation(id);
    res.json(conversation);
  } catch (error) {
    console.error('Error in get-conversation endpoint:', error);
    
    if (error.message.includes('HTTP 404')) {
      res.status(404).json({ 
        error: 'Conversation not found', 
        details: 'The specified conversation does not exist' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to get conversation', 
        details: error.message 
      });
    }
  }
});

// End conversation endpoint
app.post('/api/conversation/:id/end', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    const result = await endConversation(id);
    res.json(result);
  } catch (error) {
    console.error('Error in end-conversation endpoint:', error);
    
    if (error.message.includes('HTTP 404')) {
      res.status(404).json({ 
        error: 'Conversation not found', 
        details: 'The specified conversation does not exist or has already ended' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to end conversation', 
        details: error.message 
      });
    }
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Tavus API configured: ${!!TAVUS_API_KEY}`);
  console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});