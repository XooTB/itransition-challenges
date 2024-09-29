import type { FabricObject } from "fabric";

export default interface Slide {
	id: number;
	slideData: {
		version: string;
		objects?: FabricObject[];
	};
}
