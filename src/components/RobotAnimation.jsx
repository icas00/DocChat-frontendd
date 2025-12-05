import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import defaultRobotData from '../animations/robot-placeholder.json';

import useReducedMotion from '../hooks/useReducedMotion';

const RobotAnimation = ({ state, eyeColor, outlineColor, animationData }) => {
    const lottieRef = useRef();
    const reducedMotion = useReducedMotion();

    // Use provided animation data or fallback to default
    const sourceData = animationData || defaultRobotData;

    // Memoize the animation data to prevent unnecessary re-renders
    const finalAnimationData = React.useMemo(() => {
        const data = JSON.parse(JSON.stringify(sourceData)); // Deep clone

        // Helper to convert color string to Lottie color array [r, g, b, a]
        const toLottieColor = (colorStr) => {
            if (!colorStr) return null;

            // Handle hex
            if (colorStr.startsWith('#')) {
                const r = parseInt(colorStr.slice(1, 3), 16) / 255;
                const g = parseInt(colorStr.slice(3, 5), 16) / 255;
                const b = parseInt(colorStr.slice(5, 7), 16) / 255;
                return [r, g, b, 1];
            }

            // Handle rgb/rgba
            if (colorStr.startsWith('rgb')) {
                const parts = colorStr.match(/\d+/g).map(Number);
                return [parts[0] / 255, parts[1] / 255, parts[2] / 255, 1];
            }

            return null;
        };

        // Update colors if provided
        if (eyeColor || outlineColor) {
            const newEyeColor = toLottieColor(eyeColor);
            const newOutlineColor = toLottieColor(outlineColor);

            // Recursive function to traverse layers and shapes
            const traverseShapes = (items) => {
                items.forEach(item => {
                    // Check for Groups that might contain Small Paths (likely details/power button)
                    if (item.ty === 'gr' && item.it) {
                        // Find the Path shape ('sh') within the group
                        const pathShape = item.it.find(child => child.ty === 'sh');

                        if (pathShape && pathShape.ks && pathShape.ks.k && pathShape.ks.k.v) {
                            const vertexCount = pathShape.ks.k.v.length;
                            const isClosed = pathShape.ks.c; // c=true (closed), c=false (open)

                            // Heuristic: 
                            // 1. Small shapes (< 60 vertices) are likely details.
                            // 2. Open paths (isClosed === false) are likely the power button arc/line.
                            // The main body is closed and has many vertices.
                            if (vertexCount < 60 || !isClosed) {
                                // This is a detail shape. Force its stroke to RED.
                                item.it.forEach(child => {
                                    if (child.ty === 'st') {
                                        child.c.k = [1, 0.29, 0.29, 1]; // rgb(255, 75, 75)
                                    }
                                });
                                // Do NOT recurse into this group for standard coloring
                                return;
                            }
                        }
                    }

                    // Update Fill (Eyes)
                    if (item.ty === 'fl' && newEyeColor) {
                        // Check if this is likely an eye (usually cyan/blueish or specifically named)
                        // For now, we rely on the parent layer check in the main loop, 
                        // but if we want to be more generic, we could check current color.
                    }

                    // Update Stroke (Outlines)
                    if (item.ty === 'st' && newOutlineColor) {
                        // Check if current color is black (or close to it)
                        const c = item.c.k;
                        // Lottie colors are 0-1. Black is [0,0,0,1]
                        if (c[0] < 0.1 && c[1] < 0.1 && c[2] < 0.1) {
                            item.c.k = newOutlineColor;
                        }
                    }

                    // Also check fills that are black (some outlines might be fills)
                    if (item.ty === 'fl' && newOutlineColor) {
                        const c = item.c.k;
                        if (c[0] < 0.1 && c[1] < 0.1 && c[2] < 0.1) {
                            item.c.k = newOutlineColor;
                        }
                    }

                    if (item.it) {
                        traverseShapes(item.it);
                    }
                });
            };

            data.layers.forEach(layer => {
                // Specific Eye Color Update
                if (newEyeColor && (layer.nm === 'L eye' || layer.nm === 'R eye')) {
                    if (layer.shapes) {
                        layer.shapes.forEach(shapeGroup => {
                            if (shapeGroup.it) {
                                shapeGroup.it.forEach(item => {
                                    if (item.ty === 'fl') {
                                        item.c.k = newEyeColor;
                                    }
                                });
                            }
                        });
                    }
                }

                // Global Outline Update (Traverse all shapes in all layers)
                if (newOutlineColor && layer.shapes) {
                    traverseShapes(layer.shapes);
                }
            });
        }

        return data;
    }, [eyeColor, outlineColor, sourceData]);

    useEffect(() => {
        if (!lottieRef.current) return;

        if (reducedMotion) {
            lottieRef.current.pause();
            return;
        }

        lottieRef.current.play();

        // Adjust animation behavior based on state
        switch (state) {
            case 'hero':
                lottieRef.current.setSpeed(0.5);
                break;
            case 'knowledge':
                lottieRef.current.setSpeed(1.5);
                break;
            case 'personality':
                lottieRef.current.setSpeed(1.0);
                break;
            case 'deploy':
                lottieRef.current.setSpeed(2.5);
                break;
            default:
                lottieRef.current.setSpeed(1);
        }
    }, [state, reducedMotion]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Lottie
                lottieRef={lottieRef}
                animationData={finalAnimationData}
                loop={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default RobotAnimation;
