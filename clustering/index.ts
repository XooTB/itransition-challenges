interface Point3D {
  x: number;
  y: number;
  z: number;
}

class KMeansClusterer {
  private centroids: Point3D[] = [];

  constructor(
    private points: Point3D[],
    private k: number,
    private maxIterations: number = 100
  ) {}

  public cluster(): Point3D[] {
    // Select some random centroids
    this.centroids = this.points
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, this.k);

    // Initialize iteration count and the convergence flag
    let iterations = 0;
    let hasChanged = true;

    while (hasChanged && iterations < this.maxIterations) {
      // Create empty clusters
      const clusters: Point3D[][] = Array(this.k)
        .fill([])
        .map(() => []);

      // Assign the points to the clusters
      this.assignPointsToClusters(clusters);

      // Calculate new centroids everytime for each of the clusters
      const newCentroids = clusters.map((cluster) => {
        // If the cluster is empty, use the first centroid as fallback
        if (cluster.length === 0) return this.centroids[0];

        // Calculate the sum of the x, y, z coordinates for all points in the cluster
        const sum = cluster.reduce(
          (acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y,
            z: acc.z + point.z,
          }),
          { x: 0, y: 0, z: 0 }
        );

        // Calculate the average mean position for the new centroid
        return {
          x: sum.x / cluster.length,
          y: sum.y / cluster.length,
          z: sum.z / cluster.length,
        };
      });

      // Check if the centroids' positions have moved significantly (#convergence check)
      // Uses a small threshold (0.0001) to account for floating point precision
      hasChanged = newCentroids.some(
        (centroid, i) => this.getDistance(centroid, this.centroids[i]) > 0.0001
      );

      // Update the centroids for the next iteration cycle.
      this.centroids = newCentroids;
      iterations++;
    }

    // Return the final centroids
    return this.centroids;
  }

  // Assign each point to the nearest centroid
  private assignPointsToClusters(clusters: Point3D[][]): void {
    for (const point of this.points) {
      const closestCentroidIndex = this.findClosestCentroid(point);
      clusters[closestCentroidIndex].push(point);
    }
  }

  // Find the nearest centroid to a point
  private findClosestCentroid(point: Point3D): number {
    let shortestDistance = Infinity;
    let closestCentroidIndex = 0;

    this.centroids.forEach((centroid, index) => {
      const distance = this.getDistance(point, centroid);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestCentroidIndex = index;
      }
    });

    return closestCentroidIndex;
  }

  // Calculate the distance between two points
  private getDistance(p1: Point3D, p2: Point3D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

// Points to cluster
const points = [
  { x: 0.2, y: 0.3, z: -0.1 },
  { x: -0.1, y: 0.4, z: 0.2 },
  { x: 0.3, y: -0.2, z: 0.1 },
  { x: 4.8, y: 5.2, z: 4.9 },
  { x: 5.3, y: 4.7, z: 5.1 },
  { x: 5.0, y: 5.0, z: 4.8 },
  { x: 9.7, y: 10.2, z: 9.8 },
  { x: 10.3, y: 9.8, z: 10.1 },
  { x: 9.9, y: 10.0, z: 9.9 },
  { x: 14.8, y: 15.2, z: 14.9 },
  { x: 15.1, y: 14.9, z: 15.2 },
  { x: 15.0, y: 15.0, z: 15.0 },
];

const kMeans = new KMeansClusterer(points, 4);
console.log(kMeans.cluster());
