### Liaison React SDK
[liaison-core](https://www.npmjs.com/package/liaison-core) is a wrapper on the browser `postMessage` API, which allows windows and embedded iframes to securely send messages and data using CORS.
- Please reference this library for more information on the core API.

[liaison-react](https://www.npmjs.com/package/liaison-react) exports React hooks that can be used to utilize this library in a more Reacty way.

### Parent Model in Action
```tsx
// ... App.tsx
import { useState } from 'react';
import { useParent } from 'liaison-react';
import { nanoid } from 'nanoid';

import './App.css'

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function App() {
  const [logoutRequests, setLogoutRequests] = useState(0);

  const { callIFrameEffect } = useParent({
    iframe: {
      id: 'my-embedded-iframe',
      src: 'http://localhost:3002',
    }
    effects: {
      logout: () => {
        setLogoutRequests(prevNumber => prevNumber + 1);
      },
      sendToken: ({ callIFrameEffect }) => {
        const token = nanoid();
        callIFrameEffect({
          name: 'saveToken',
          args: {token},
        });
      },
      sendTokenAsync: async ({ callIFrameEffect }) => {
        await timeout(3000);
        const token = nanoid();
        callIFrameEffect({
          name: 'saveToken',
          args: {token},
        });
      }
    }
  })

  return (
    <>
      <h1>Parent Window</h1>
      <div className='buttons'>
        <p>Request to run events within the iFrame!</p>
        <button onClick={initiateChildLogout}>
          Initiate <em>Child</em> Logout Process
        </button>
      </div>
      <div>
        <h2>Logout Requests:</h2>
        <p>{logoutRequests}</p>
      </div>
      <div id="my-embedded-iframe-container">
        <iframe id="my-embedded-iframe" src="http://localhost:3002" className="iframe"></iframe>
      </div>
    </>
  )

  function initiateChildLogout() {
    callIFrameEffect({ name: 'logout', args: {} });
  }
}

export default App

// ... main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

```

### IFrame Model in Action
```jsx
// ... App.tsx
import { useState } from 'react';
import { useIFrame } from 'liaison-react';
import './App.css'

function App() {
  const [logoutRequests, setLogoutRequests] = useState(0);
  const [tokens, setTokens] = useState<Array<string>>([]);

  const { callParentEffect } = useIFrame({
    parentOrigin: 'http://localhost:3003',
    effects: {
      logout: () => setLogoutRequests(prevNum => prevNum + 1),
      saveToken: ({ args: { token } }) => {
        setTokens(prevTokens => [...prevTokens, token]);
      },
      saveTokenAsync: ({ args: { token } }) => {
        setTokens(prevTokens => [...prevTokens, token]);
      },
    }
  })

  return (
    <>
      <h1>Child Window</h1>
      <div className="buttons">
        <p className="buttons-header">Request to run events within the Parent window!</p>
        <button onClick={initiateParentLogout} className="btn">Initiate <em>Parent</em> Logout Process</button>
        <button onClick={requestTokenFromParent} className="btn">Request Token from Parent (Get Synchronously)</button>
        <button onClick={requestTokenFromParentAsync} className="btn">Request Token from Parent (Get Asynchronously)</button>
      </div>
      <div>
        <h2>Logout Requests:</h2>
        <p>{logoutRequests}</p>
        <h2>Tokens:</h2>
        <ul>
          {tokens.map((token) => <li key={token}>Token: {token}</li>)}
        </ul>
      </div>
    </>
  )

  function initiateParentLogout() {
    callParentEffect({
      name: 'logout',
    })
  }

  function requestTokenFromParent() {
    callParentEffect({
      name: 'sendToken',
    })
  }

  function requestTokenFromParentAsync() {
    callParentEffect({
      name: 'sendTokenAsync',
    })
  }

}

export default App

// ... main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```