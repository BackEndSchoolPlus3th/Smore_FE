// AutoHideScrollContainer.js
import React, { useState, useEffect, useRef } from 'react';

import { ReactNode } from 'react';

function AutoHideScrollContainer({ children }: { children: ReactNode }) {
    const [showScrollbar, setShowScrollbar] = useState(false);
    const scrollRef = useRef(null);
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = () => {
        setShowScrollbar(true);
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
            setShowScrollbar(false);
        }, 2000);
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            (scrollElement as HTMLElement).addEventListener(
                'scroll',
                handleScroll
            );
        }
        return () => {
            (scrollElement as unknown as HTMLElement).removeEventListener(
                'scroll',
                handleScroll
            );
            if (timeoutId.current) clearTimeout(timeoutId.current);
        };
    }, []);

    return (
        <div
            ref={scrollRef}
            className="auto-hide-scroll overflow-y-auto h-100vh"
        >
            {children}
            <style>{`
                .auto-hide-scroll::-webkit-scrollbar {
                    width: 8px;
                    transition: opacity 0.5s;
                    opacity: ${showScrollbar ? 1 : 0};
                }
                .auto-hide-scroll::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}

export default AutoHideScrollContainer;
