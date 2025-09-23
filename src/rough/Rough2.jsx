import React, { useState, useEffect } from "react";

const PuterChat = () => {
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);


    const sendMessage = async () => {
        if (!message.trim() || !window.puter) return;

        setLoading(true);
        try {
            const res = await window.puter.ai.chat(message, { model: "gpt-5-nano" });
            console.log(res);
            // Puter returns the content in res.choices[0].message.content
            setReply(res?.message?.content || "No response from AI.");
        } catch (err) {
            console.error("Error calling Puter AI:", err);
            setReply("Error calling AI.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Puter AI Chat</h2>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ width: "40%", padding: 10 }}
            />
            <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>
                {loading ? "Thinking..." : "Send"}
            </button>
            <div
                style={{
                    marginTop: 20,
                    background: "#f1f1f1",
                    padding: 15,
                    borderRadius: 5,
                    minHeight: 50,
                }}
            >
                {reply}
            </div>
        </div>
    );
};

export default PuterChat;
