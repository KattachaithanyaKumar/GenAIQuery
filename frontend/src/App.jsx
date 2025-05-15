import React, { useEffect, useState, useRef } from 'react';
import { Button, ConfigProvider, Input, Splitter } from 'antd';
import './App.css';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { RiRobot2Line } from "react-icons/ri";
import NativeTable from './components/NativeTable'; // <-- Import here

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [tableData, setTableData] = useState([]);

  const chatEndRef = useRef(null); // Reference for auto-scrolling

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = () => {
    fetch("http://127.0.0.1:8000/table")
      .then((res) => res.json())
      .then((data) => setTableData(data.data.result))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    // Auto-scroll the chat to the bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Triggered when messages change

  function cleanSqlString(sql) {
    return sql.replace(/```sql\n?/, '').replace(/```$/, '').trim();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { role: 'user', content: input };
    const aiTypingMessage = { role: 'ai', content: <><RiRobot2Line /> &nbsp; ...</> };
  
    const newMessages = [...messages, userMessage, aiTypingMessage];
    setMessages(newMessages);
    setInput('');
  
    try {
      const response = await fetch("http://127.0.0.1:8000/query", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });
  
      const data = await response.json();
      console.log(data);
  
      const formattedSql = cleanSqlString(data.sql);
      let resultContent = null;
  
      const result = data.result?.result;
      const responseType = data.result?.response_type;
  
      if (responseType === "table" && Array.isArray(result)) {
        resultContent = <NativeTable data={result} />;
      } else if (responseType === "status") {
        resultContent = (
          <div style={{display: "flex", alignItems: "center"}}>
            <RiRobot2Line size={24} /> &nbsp; <strong>Status:</strong> {result?.status || "Unknown"}
          </div>
        );
      } else if (responseType === "aggregate" && typeof result === "object") {
        resultContent = (
          <div style={{display: "flex", alignItems: "center"}}>
            <RiRobot2Line size={24} /> &nbsp;
            {result.length > 1 ? (
              <NativeTable data={result} />
            ) : (
              <>
                {result.map((item, index) => (
                  <div key={index}>
                    {Object.entries(item).map(([key, value]) => (
                      <span key={key}>
                        <strong>{key}</strong>: {value} <br />
                      </span>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        );
      } else {
        resultContent = <div><RiRobot2Line size={24} /> &nbsp; Error: Unexpected response type.</div>;
      }
  
      const updatedMessages = [...newMessages];
      updatedMessages[updatedMessages.length - 1] = {
        role: 'ai',
        content: (
          <div>
            <div style={{ marginBottom: resultContent ? "20px" : "0px" }}>
              <RiRobot2Line size={24} /> &nbsp; <code>{formattedSql}</code>
            </div>
            {resultContent}
          </div>
        ),
      };
  
      setMessages(updatedMessages);
    } catch (err) {
      console.error(err);
      const updatedMessages = [...newMessages];
      updatedMessages[updatedMessages.length - 1] = {
        role: 'ai',
        content: <><RiRobot2Line /> &nbsp; Error generating SQL.</>,
      };
      setMessages(updatedMessages);
    } finally {
      fetchTableData();
    }
  };
  
  

  return (
    <div className="app">
      <Splitter style={{ height: '100vh' }}>
        <Splitter.Panel defaultSize={"40%"} max="70%">
          <div className="space">
            <h1>Chat</h1>
            <div className="chat-area">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                  {msg.content}
                </div>
              ))}
              {/* Scroll to the bottom of the chat area */}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSubmit}>
              <Input
                className="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoSize
                placeholder="Type your message..."
              />
              <Button htmlType="submit">
                <FaArrowAltCircleRight size={24} />
              </Button>
            </form>
          </div>
        </Splitter.Panel>

        <Splitter.Panel max="70%">
          <div className="tables">
            <h1>Tables</h1>
            <h3 style={{ marginBottom: "10px" }}>Employees</h3>
            <NativeTable data={tableData} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default App;
