import * as React from "react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";

export default function Loading() {
    const loadingRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useLayoutEffect(() => {
        if (loadingRef.current) {
            setContainerWidth(loadingRef.current.clientWidth);
        }
    }, [loadingRef]);

    return (
        <div
            ref={loadingRef}
            className="w-full h-[2px] absolute top-0 left-0 right-0 overflow-hidden"
        >
            {containerWidth > 0 && (
                <motion.div
                    initial={{ x: "0%" }}
                    animate={{
                        x: `${containerWidth}px`,
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="h-full bg-violet-600 w-[10%]"
                />
            )}
        </div>
    );
}
