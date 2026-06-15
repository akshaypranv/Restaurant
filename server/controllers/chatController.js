const config = require('../config/config');

// POST /api/v1/chat - Chatbot endpoint (proxies to Anthropic Claude via native fetch)
const handleChat = async (req, res, next) => {
  try {
    let { messages, menuContext } = req.body;

    // Truncate to last 10 messages to protect token limits
    if (messages.length > 10) {
      messages = messages.slice(-10);
    }

    // Ensure messages alternate starting with a 'user' message
    while (messages.length > 0 && messages[0].role !== 'user') {
      messages.shift();
    }

    if (messages.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Chat history must start with a user message',
        code: 'BAD_REQUEST'
      });
    }

    // Format menu context into system prompt
    let menuContextText = '';
    if (menuContext) {
      menuContextText = '\n\nHere is the current menu context for Silvertip Cafe:\n' + JSON.stringify(menuContext);
    }

    const systemPrompt = `You are Brewed, the friendly AI assistant for Silvertip Cafe. You help customers with menu questions, hours, specials, and reservations. Be warm, concise, and occasionally use a coffee-related pun. The cafe is open Mon-Sat 8am-10pm, Sun 9am-8pm. Our address is 12 Roast Lane, Coimbatore. You have access to the menu via context provided to you. If unsure, politely say so.${menuContextText}`;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Fallback Mock Response for Testing / Development if API key is not present
    if (!apiKey || apiKey.startsWith('your-') || apiKey.startsWith('mock')) {
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      let reply = "I'd love to help you with that! At Silvertip Cafe, we pride ourselves on our fresh menu items. Is there anything specific from our menu I can tell you about? (Note: Running in Mock Mode)";
      
      const lowerMsg = lastUserMessage.toLowerCase();
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        reply = "Hello there! Welcome to Silvertip Cafe. I'm Brewed, your friendly AI assistant. How can I help you espresso yourself today? ☕";
      } else if (lowerMsg.includes('hour') || lowerMsg.includes('open') || lowerMsg.includes('time')) {
        reply = "We are open Mon-Sat 8am-10pm, and Sun 9am-8pm. Stop by for your daily grind!";
      } else if (lowerMsg.includes('where') || lowerMsg.includes('address') || lowerMsg.includes('location')) {
        reply = "You can find us at 12 Roast Lane, Coimbatore. We'd love to see you!";
      } else if (lowerMsg.includes('paneer') || lowerMsg.includes('veg')) {
        reply = "Yes, we have delicious vegetarian options like Paneer Tikka (₹275) and Chilli Paneer (₹250). They are a latte fun to eat!";
      }

      return res.status(200).json({
        status: 'success',
        data: { reply }
      });
    }

    // Call Anthropic Messages API using native fetch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages.map(msg => ({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content
            }))
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[ChatBot API Error] Failed calling Anthropic API:', errorData);
        return res.status(502).json({
          status: 'error',
          message: 'Failed to communicate with AI service provider',
          code: 'BAD_GATEWAY'
        });
      }

      const resData = await response.json();
      const reply = resData.content[0].text;

      return res.status(200).json({
        status: 'success',
        data: { reply }
      });
    } catch (apiErr) {
      console.error('[ChatBot API Error] Failed calling Anthropic API:', apiErr.message);
      return res.status(502).json({
        status: 'error',
        message: 'Failed to communicate with AI service provider',
        code: 'BAD_GATEWAY'
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleChat
};
