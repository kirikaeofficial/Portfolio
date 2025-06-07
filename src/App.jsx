import React from 'react';
import GridBackground from './GridBackground';
import IntroText from './1';

function App() {
    return (
        <>
            <GridBackground />
            {/* コンテンツの上に IntroText を表示 */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <IntroText />
            </div>
        </>
    );
}

export default App;