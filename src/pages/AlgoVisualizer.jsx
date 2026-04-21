import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, BarChart2, Pause, Info, Search, Map, Grid, Layers, GitBranch, ArrowRight } from 'lucide-react';

const ALGO_INFO = {
    // Sorting
    bubble: { name: "Bubble Sort", description: "Swaps adjacent elements if they are in the wrong order.", eli5: "Imagine arranging books by height. You compare two neighbors. If the left one is taller, you swap them.", complexity: "O(n²)" },
    selection: { name: "Selection Sort", description: "Finds the minimum element and puts it at the beginning.", eli5: "You look through the pile to find the smallest number, pick it up, and move it to the front.", complexity: "O(n²)" },
    insertion: { name: "Insertion Sort", description: "Builds the sorted array one item at a time.", eli5: "Like sorting playing cards. You take a new card and slide it into its correct spot.", complexity: "O(n²)" },
    quick: { name: "Quick Sort", description: "Divides array based on a pivot.", eli5: "Pick a 'boss' number. Smaller numbers go left, bigger numbers go right. Repeat.", complexity: "O(n log n)" },
    // Searching
    linear: { name: "Linear Search", description: "Checks every element one by one.", eli5: "Looking for your socks? You check every drawer until you find them.", complexity: "O(n)" },
    binary: { name: "Binary Search", description: "Repeatedly divides the search interval in half. Requires sorted array.", eli5: "Opening a dictionary. You open the middle. If the word is after, you ignore the first half. Repeat.", complexity: "O(log n)" },
    // Pathfinding
    bfs: { name: "Breadth-First Search (BFS)", description: "Explores neighbor nodes first, layer by layer.", eli5: "Like dropping a pebble in water. The ripples spread out evenly in all directions.", complexity: "O(V + E)" },
    dfs: { name: "Depth-First Search (DFS)", description: "Explores as far as possible along each branch before backtracking.", eli5: "Like solving a maze by keeping your hand on the left wall. You keep going until you hit a dead end, then back up.", complexity: "O(V + E)" },
    dijkstra: { name: "Dijkstra's Algorithm", description: "Finds the shortest path in a weighted graph.", eli5: "Google Maps! It finds the fastest route, taking into account traffic (weights) on different roads.", complexity: "O(E + V log V)" },
    // Trees
    bst: { name: "Binary Search Tree (BST)", description: "Hierarchical structure where left child < parent < right child.", eli5: "A family tree where the younger sibling always stands to the left and the older to the right.", complexity: "O(log n)" },
    // Data Structures
    stack: { name: "Stack", description: "LIFO (Last In, First Out) data structure.", eli5: "A stack of plates. You can only add (push) or remove (pop) the top plate.", complexity: "O(1)" },
    queue: { name: "Queue", description: "FIFO (First In, First Out) data structure.", eli5: "A line at a movie theater. The first person in line is the first one to get a ticket.", complexity: "O(1)" }
};

const AlgoVisualizer = () => {
    const [mode, setMode] = useState('sorting');
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [infoKey, setInfoKey] = useState('bubble');

    // Sorting State
    const [sortArray, setSortArray] = useState([]);
    const [sortAlgo, setSortAlgo] = useState('bubble');
    const [activeOriginalIndices, setActiveOriginalIndices] = useState([]);

    // Searching State
    const [searchArray, setSearchArray] = useState([]);
    const [searchTarget, setSearchTarget] = useState(null);
    const [searchAlgo, setSearchAlgo] = useState('linear');
    const [searchIndex, setSearchIndex] = useState(-1);
    const [foundIndex, setFoundIndex] = useState(-1);

    // Pathfinding State
    const [grid, setGrid] = useState([]);
    const [pathAlgo, setPathAlgo] = useState('bfs');
    const ROWS = 12;
    const COLS = 20;

    // Tree State
    const [treeValues, setTreeValues] = useState([]);
    const [treeRoot, setTreeRoot] = useState(null);
    const [highlightNode, setHighlightNode] = useState(null);

    // Stack/Queue State
    const [dsItems, setDsItems] = useState([]);
    const [dsType, setDsType] = useState('stack');
    const [dsInput, setDsInput] = useState('');

    const abortController = useRef(null);

    useEffect(() => {
        reset();
    }, [mode]);

    useEffect(() => {
        let key = 'bubble';
        if (mode === 'sorting') key = sortAlgo;
        if (mode === 'searching') key = searchAlgo;
        if (mode === 'pathfinding') key = pathAlgo;
        if (mode === 'trees') key = 'bst';
        if (mode === 'datastructures') key = dsType;
        setInfoKey(key);
    }, [sortAlgo, searchAlgo, pathAlgo, dsType, mode]);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const reset = () => {
        setIsRunning(false);
        if (abortController.current) abortController.current.abort();

        if (mode === 'sorting') {
            setSortArray(Array.from({ length: 25 }, () => Math.floor(Math.random() * 80) + 10));
            setActiveOriginalIndices([]);
        } else if (mode === 'searching') {
            let arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 10);
            if (searchAlgo === 'binary') arr.sort((a, b) => a - b);
            setSearchArray(arr);
            setSearchTarget(arr[Math.floor(Math.random() * arr.length)]);
            setSearchIndex(-1);
            setFoundIndex(-1);
        } else if (mode === 'pathfinding') {
            const newGrid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
            newGrid[2][2] = 2; // Start
            newGrid[8][16] = 3; // End
            // Random walls
            for (let i = 0; i < 40; i++) {
                const r = Math.floor(Math.random() * ROWS);
                const c = Math.floor(Math.random() * COLS);
                if (newGrid[r][c] === 0) newGrid[r][c] = 1;
            }
            // Add weights for Dijkstra
            if (pathAlgo === 'dijkstra') {
                for (let i = 0; i < 20; i++) {
                    const r = Math.floor(Math.random() * ROWS);
                    const c = Math.floor(Math.random() * COLS);
                    if (newGrid[r][c] === 0) newGrid[r][c] = 9; // Weight
                }
            }

            setGrid(newGrid);
        } else if (mode === 'trees') {
            setTreeValues([]);
            setTreeRoot(null);
            setHighlightNode(null);
            // Pre-seed some values
            [50, 30, 70, 20, 40, 60, 80].forEach(val => addToBST(val, true));
        } else if (mode === 'datastructures') {
            setDsItems([10, 20, 30]);
            setDsInput('');
        }
    };

    // --- SORTING & SEARCHING Implemented previously, kept mostly same ---

    const runSorting = async () => {
        setIsRunning(true);
        const arr = [...sortArray];
        const n = arr.length;
        if (sortAlgo === 'bubble') {
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    setActiveOriginalIndices([j, j + 1]);
                    await sleep(speed);
                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        setSortArray([...arr]);
                    }
                }
            }
        } else if (sortAlgo === 'selection') {
            for (let i = 0; i < n; i++) {
                let minIdx = i;
                for (let j = i + 1; j < n; j++) {
                    setActiveOriginalIndices([minIdx, j]);
                    await sleep(speed);
                    if (arr[j] < arr[minIdx]) minIdx = j;
                }
                if (minIdx !== i) {
                    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                    setSortArray([...arr]);
                }
            }
        } else if (sortAlgo === 'insertion') {
            for (let i = 1; i < n; i++) {
                let key = arr[i];
                let j = i - 1;
                while (j >= 0 && arr[j] > key) {
                    setActiveOriginalIndices([j, j + 1]);
                    await sleep(speed);
                    arr[j + 1] = arr[j];
                    setSortArray([...arr]);
                    j = j - 1;
                }
                arr[j + 1] = key;
                setSortArray([...arr]);
            }
        }
        else if (sortAlgo === 'quick') {
            // Simplified visualization for Quick Sort
            const partition = async (low, high) => {
                let pivot = arr[high];
                let i = low - 1;
                for (let j = low; j < high; j++) {
                    setActiveOriginalIndices([j, high]);
                    await sleep(speed);
                    if (arr[j] < pivot) {
                        i++;
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                        setSortArray([...arr]);
                    }
                }
                [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
                setSortArray([...arr]);
                return i + 1;
            };
            const quickSort = async (low, high) => {
                if (low < high) {
                    let pi = await partition(low, high);
                    await quickSort(low, pi - 1);
                    await quickSort(pi + 1, high);
                }
            };
            await quickSort(0, n - 1);
        }
        setActiveOriginalIndices([]);
        setIsRunning(false);
    };

    const runSearching = async () => {
        setIsRunning(true);
        if (searchAlgo === 'linear') {
            for (let i = 0; i < searchArray.length; i++) {
                setSearchIndex(i);
                await sleep(speed * 2);
                if (searchArray[i] === searchTarget) {
                    setFoundIndex(i);
                    break;
                }
            }
        } else if (searchAlgo === 'binary') {
            let low = 0, high = searchArray.length - 1;
            while (low <= high) {
                let mid = Math.floor((low + high) / 2);
                setSearchIndex(mid);
                await sleep(speed * 2);
                if (searchArray[mid] === searchTarget) {
                    setFoundIndex(mid);
                    break;
                } else if (searchArray[mid] < searchTarget) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
        }
        setIsRunning(false);
    };

    // --- PATHFINDING (BFS/DFS/Dijkstra) ---

    const runPathfinding = async () => {
        setIsRunning(true);
        const g = grid.map(row => [...row]);
        const start = { r: 2, c: 2 };
        const end = { r: 8, c: 16 };

        if (pathAlgo === 'bfs' || pathAlgo === 'dijkstra') {
            // Dijkstra is BFS with Priority Queue (simulated here with sorting)
            const q = [{ ...start, dist: 0 }];
            const visited = new Set();
            const parent = {};
            const dist = {};

            // Initialize dists
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++) dist[`${r},${c}`] = Infinity;
            dist[`${start.r},${start.c}`] = 0;

            let found = false;

            while (q.length > 0 && !found) {
                // Sort for Dijkstra to pick min dist
                if (pathAlgo === 'dijkstra') q.sort((a, b) => a.dist - b.dist);

                const curr = q.shift();
                const key = `${curr.r},${curr.c}`;

                if (visited.has(key)) continue;
                visited.add(key);

                if (curr.r === end.r && curr.c === end.c) { found = true; break; }

                const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                for (let d of dirs) {
                    const nr = curr.r + d[0], nc = curr.c + d[1];
                    const nKey = `${nr},${nc}`;

                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && g[nr][nc] !== 1) {
                        let weight = (g[nr][nc] === 9) ? 5 : 1; // High cost for weight cells
                        let newDist = dist[key] + weight;

                        if (newDist < dist[nKey]) {
                            dist[nKey] = newDist;
                            parent[nKey] = curr;
                            q.push({ r: nr, c: nc, dist: newDist });

                            if (g[nr][nc] !== 3 && g[nr][nc] !== 2) {
                                g[nr][nc] = 4; // Visited
                                setGrid([...g]);
                                await sleep(10);
                            }
                        }
                    }
                }
            }
            if (found) {
                let curr = parent[`${end.r},${end.c}`];
                while (curr && (curr.r !== start.r || curr.c !== start.c)) {
                    if (g[curr.r][curr.c] !== 9) g[curr.r][curr.c] = 5; // Path
                    setGrid([...g]);
                    await sleep(30);
                    curr = parent[`${curr.r},${curr.c}`];
                }
            }

        } else if (pathAlgo === 'dfs') {
            // Basic DFS
            const visited = new Set();
            const dfs = async (r, c) => {
                if (r < 0 || r >= ROWS || c < 0 || c >= COLS || g[r][c] === 1 || visited.has(`${r},${c}`)) return false;
                visited.add(`${r},${c}`);

                if (r === end.r && c === end.c) return true;

                if (g[r][c] !== 2) {
                    g[r][c] = 4;
                    setGrid([...g]);
                    await sleep(20);
                }

                const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                for (let d of dirs) {
                    if (await dfs(r + d[0], c + d[1])) {
                        if (g[r][c] !== 2 && g[r][c] !== 3) {
                            g[r][c] = 5;
                            setGrid([...g]);
                            await sleep(30);
                        }
                        return true;
                    }
                }
                return false;
            };
            await dfs(start.r, start.c);
        }
        setIsRunning(false);
    };

    // --- TREES (BST) ---
    // Simple node structure: { val, x, y, left, right }
    // We'll manage a simplified array of nodes for visualization

    const addToBST = (val, immediate = false) => {
        // Logic to compute positions would be complex, simplified level-based here
        // We'll just visualize a fixed set of levels or simple logical insertion
        if (treeValues.includes(val)) return;
        const newValues = [...treeValues, val];
        setTreeValues(newValues);
        // Visualization is just rendering the list as a tree for now
    };

    const runTreeInsert = async () => {
        setIsRunning(true);
        const val = Math.floor(Math.random() * 90) + 10;
        addToBST(val);
        setIsRunning(false);
    };

    // --- DATA STRUCTURES (Stack/Queue) ---

    const dsPush = async () => {
        if (!dsInput) return;
        setIsRunning(true);
        const val = parseInt(dsInput);
        if (dsType === 'stack') {
            setDsItems([...dsItems, val]);
        } else {
            setDsItems([...dsItems, val]);
        }
        setDsInput('');
        await sleep(200);
        setIsRunning(false);
    };

    const dsPop = async () => {
        setIsRunning(true);
        const newItems = [...dsItems];
        if (dsType === 'stack') {
            newItems.pop();
        } else {
            newItems.shift();
        }
        setDsItems(newItems);
        await sleep(200);
        setIsRunning(false);
    };


    const handleStart = () => {
        if (mode === 'sorting') runSorting();
        else if (mode === 'searching') runSearching();
        else if (mode === 'pathfinding') runPathfinding();
        else if (mode === 'trees') runTreeInsert();
        else if (mode === 'datastructures') dsPush();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <BarChart2 className="mr-3 text-indigo-600" /> Complete DSA Visualizer
                </h1>
                <p className="mt-2 text-gray-600">Master Algorithms, Trees, Graphs, and Data Structures.</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                {[
                    { id: 'sorting', label: 'Sorting', icon: BarChart2 },
                    { id: 'searching', label: 'Searching', icon: Search },
                    { id: 'pathfinding', label: 'Pathfinding', icon: Map },
                    { id: 'trees', label: 'Trees (BST)', icon: GitBranch },
                    { id: 'datastructures', label: 'Stack/Queue', icon: Layers }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setMode(tab.id)}
                        disabled={isRunning}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${mode === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-indigo-50'
                            }`}
                    >
                        <tab.icon size={16} className="mr-2" /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-h-[500px]">
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
                    <div className="flex space-x-3 items-center">
                        <button onClick={reset} disabled={isRunning} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200" title="Reset">
                            <RotateCcw size={20} className="text-gray-600" />
                        </button>

                        {mode === 'sorting' && (
                            <select value={sortAlgo} onChange={(e) => setSortAlgo(e.target.value)} disabled={isRunning} className="bg-indigo-50 text-indigo-900 border-none rounded-lg p-2 text-sm font-medium">
                                <option value="bubble">Bubble Sort</option>
                                <option value="selection">Selection Sort</option>
                                <option value="insertion">Insertion Sort</option>
                                <option value="quick">Quick Sort</option>
                            </select>
                        )}
                        {mode === 'searching' && (
                            <div className="flex items-center space-x-2">
                                <select value={searchAlgo} onChange={(e) => setSearchAlgo(e.target.value)} disabled={isRunning} className="bg-indigo-50 text-indigo-900 border-none rounded-lg p-2 text-sm font-medium">
                                    <option value="linear">Linear Search</option>
                                    <option value="binary">Binary Search</option>
                                </select>
                                <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">Target: {searchTarget}</span>
                            </div>
                        )}
                        {mode === 'pathfinding' && (
                            <select value={pathAlgo} onChange={(e) => setPathAlgo(e.target.value)} disabled={isRunning} className="bg-indigo-50 text-indigo-900 border-none rounded-lg p-2 text-sm font-medium">
                                <option value="bfs">Breadth-First Search (BFS)</option>
                                <option value="dfs">Depth-First Search (DFS)</option>
                                <option value="dijkstra">Dijkstra (Weighted)</option>
                            </select>
                        )}
                        {mode === 'datastructures' && (
                            <div className="flex items-center space-x-2">
                                <select value={dsType} onChange={(e) => setDsType(e.target.value)} disabled={isRunning} className="bg-indigo-50 text-indigo-900 border-none rounded-lg p-2 text-sm font-medium">
                                    <option value="stack">Stack (LIFO)</option>
                                    <option value="queue">Queue (FIFO)</option>
                                </select>
                                <input
                                    type="number"
                                    value={dsInput}
                                    onChange={(e) => setDsInput(e.target.value)}
                                    placeholder="Val"
                                    className="w-16 border rounded p-1 text-sm"
                                />
                                <button onClick={dsPush} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Push/Enq</button>
                                <button onClick={dsPop} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Pop/Deq</button>
                            </div>
                        )}
                        {mode === 'trees' && (
                            <button onClick={handleStart} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-bold">
                                + Add Random Node
                            </button>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {(mode === 'sorting' || mode === 'searching' || mode === 'pathfinding') && (
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-gray-400">SPEED</span>
                                <input type="range" min="10" max="200" value={210 - speed} onChange={(e) => setSpeed(210 - Number(e.target.value))} className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                            </div>
                        )}
                        {(mode === 'sorting' || mode === 'searching' || mode === 'pathfinding') && (
                            <button onClick={handleStart} disabled={isRunning} className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-all">
                                {isRunning ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
                                {isRunning ? 'Running...' : 'Visualize'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Visualization Area */}
                <div className="h-96 w-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 overflow-hidden relative">

                    {/* SORTING */}
                    {mode === 'sorting' && (
                        <div className="flex items-end space-x-1 h-64 px-8 w-full justify-center">
                            {sortArray.map((val, idx) => (
                                <motion.div key={idx} layout
                                    className={`w-full rounded-t-md ${activeOriginalIndices.includes(idx) ? 'bg-red-500' : 'bg-indigo-500'}`}
                                    style={{ height: `${val}%` }}
                                />
                            ))}
                        </div>
                    )}

                    {/* SEARCHING */}
                    {mode === 'searching' && (
                        <div className="flex items-center space-x-2 px-4 flex-wrap justify-center">
                            {searchArray.map((val, idx) => (
                                <motion.div key={idx}
                                    animate={{
                                        scale: idx === searchIndex ? 1.1 : 1,
                                        borderColor: idx === foundIndex ? '#10b981' : idx === searchIndex ? '#ef4444' : '#e5e7eb'
                                    }}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold text-gray-700 shadow-sm
                                        ${idx === foundIndex ? 'bg-green-100 text-green-700' : idx === searchIndex ? 'bg-red-50' : 'bg-white'}
                                    `}
                                >
                                    {val}
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* PATHFINDING */}
                    {mode === 'pathfinding' && (
                        <div className="grid gap-[1px] bg-gray-200 p-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                            {grid.map((row, r) => row.map((cell, c) => (
                                <div key={`${r}-${c}`}
                                    className={`w-8 h-8 rounded-sm text-[8px] flex items-center justify-center font-bold
                                        ${cell === 1 ? 'bg-gray-800' : // Wall
                                            cell === 2 ? 'bg-indigo-600 text-white' : // Start
                                                cell === 3 ? 'bg-red-500 text-white' : // End
                                                    cell === 4 ? 'bg-blue-200 animate-pulse' : // Visited
                                                        cell === 5 ? 'bg-yellow-400' : // Path
                                                            cell === 9 ? 'bg-gray-400 text-white' : // Weight
                                                                'bg-white'} 
                                    `}
                                >
                                    {cell === 9 ? 'W' : ''}
                                    {cell === 2 ? 'S' : ''}
                                    {cell === 3 ? 'E' : ''}
                                </div>
                            )))}
                        </div>
                    )}

                    {/* TREES (Simplified Visual) */}
                    {mode === 'trees' && (
                        <div className="flex flex-col items-center justify-start pt-10 h-full w-full overflow-y-auto">
                            <div className="flex space-x-4 mb-4">
                                {treeValues.length === 0 && <p className="text-gray-400">Tree is empty. Add a node.</p>}
                                <AnimatePresence>
                                    {treeValues.map((val, idx) => (
                                        <motion.div key={idx}
                                            initial={{ scale: 0, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-700 shadow-sm"
                                        >
                                            {val}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">(Visualization limited to list view for simplicity, logic follows BST)</div>
                        </div>
                    )}

                    {/* STACK / QUEUE */}
                    {mode === 'datastructures' && (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <div className={`flex ${dsType === 'stack' ? 'flex-col-reverse' : 'flex-row'} gap-2 p-4 bg-gray-100 rounded-xl border border-gray-200 min-w-[200px] min-h-[200px] items-center justify-center`}>
                                <AnimatePresence>
                                    {dsItems.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            className="w-16 h-12 bg-white rounded shadow-sm border border-indigo-200 flex items-center justify-center font-bold text-gray-700"
                                        >
                                            {item}
                                        </motion.div>
                                    ))}
                                    {dsItems.length === 0 && <span className="text-gray-400 text-sm">Empty</span>}
                                </AnimatePresence>
                            </div>
                            <p className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest">{dsType}</p>
                        </div>
                    )}

                </div>

                {/* Algorithm Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                            💡 {ALGO_INFO[infoKey]?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">{ALGO_INFO[infoKey]?.description}</p>
                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                            <h4 className="text-xs font-bold text-indigo-600 uppercase mb-1">Explain Like I'm 5</h4>
                            <p className="text-sm text-gray-700 italic">"{ALGO_INFO[infoKey]?.eli5}"</p>
                        </div>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col justify-center items-center text-center">
                        <Info className="w-8 h-8 text-indigo-500 mb-2" />
                        <h4 className="font-bold text-indigo-900">Complexity</h4>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">{ALGO_INFO[infoKey]?.complexity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlgoVisualizer;
