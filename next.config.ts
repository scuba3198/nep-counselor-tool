import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	basePath: "/nep-counselor-tool",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
