// Resources:
// https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/
// https://www.geeksforgeeks.org/count-number-of-ways-to-reach-destination-in-a-maze-using-bfs/
// https://cloudfour.com/thinks/generating-random-mazes-with-javascript/ | Source for the maze generation algorithm | old but still good

const generateMaze = (
    width: number = 11,
    height: number = 11
): number[][] => {
    if (width % 2 === 0) width++;
    if (height % 2 === 0) height++;

    // Fill with walls
    const maze: number[][] = Array.from({ length: height }, () => Array(width).fill(1));
    const dirs = [
        [0, -2], // N
        [0, 2],  // S
        [2, 0],  // E
        [-2, 0], // W
    ];

    // Helper to shuffle directions
    function shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Always start at top-left
    const spawn: [number, number] = [1, 1];

    function carve(x: number, y: number) {
        maze[x][y] = 0;
        for (const [dx, dy] of shuffle([...dirs])) {
            const nx = x + dx;
            const ny = y + dy;
            if (
                nx > 0 && nx < height - 1 &&
                ny > 0 && ny < width - 1 &&
                maze[nx][ny] === 1
            ) {
                maze[x + dx / 2][y + dy / 2] = 0; // Remove wall between
                carve(nx, ny);
            }
        }
    }

    carve(spawn[0], spawn[1]);

    // Find the farthest cell from spawn using BFS
    // BFS = Breadth-First Search
    let farthest: [number, number] = spawn;
    let maxDist = 0;
    // Init visited array with false since we need to keep track of visited cells
    const visited = Array.from({ length: height }, () => Array(width).fill(false));
    // Init queue with spawn position and distance 0
    const queue: Array<{ pos: [number, number], dist: number }> = [{ pos: spawn, dist: 0 }];
    // Mark spawn as visited
    visited[spawn[0]][spawn[1]] = true;

    // BFS loop
    while (queue.length > 0) {
        const { pos, dist } = queue.shift()!;
        if (dist > maxDist) {
            maxDist = dist;
            farthest = pos;
        }
        // Check neighbors
        for (const [dx, dy] of dirs) {
            const nx = pos[0] + dx / 2;
            const ny = pos[1] + dy / 2;
            if (
                nx > 0 && nx < height - 1 &&
                ny > 0 && ny < width - 1 &&
                !visited[nx][ny] &&
                maze[nx][ny] === 0
            ) {
                visited[nx][ny] = true;
                queue.push({ pos: [nx, ny], dist: dist + 1 });
            }
        }
    }

    // Place spawn and exit
    maze[spawn[0]][spawn[1]] = 2;
    maze[farthest[0]][farthest[1]] = 3;

    return maze;
};

export default generateMaze;