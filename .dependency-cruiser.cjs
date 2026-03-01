/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: "no-circular",
			severity: "error",
			comment: "Warns about circular dependencies.",
			from: {},
			to: { circular: true },
		},
		{
			name: "components-cannot-import-app",
			severity: "error",
			comment:
				"UI components should be pure and not depend on Next.js app routing logic or server actions directly if possible (they should be passed as props or use hooks, though importing actions is sometimes okay in Next.js 14, we restrict it here for strict separation if desired, but wait: server actions in Next.js are often imported by client components. Let's restrict components from importing Next.js page components or layouts, not actions necessarily. Let's just prevent lib from importing components or app).",
			// Better rule: lib cannot import components or app
			from: { path: "^src/lib" },
			to: { path: "^src/(components|app)" },
		},
		{
			name: "components-cannot-import-pages",
			severity: "error",
			comment: "Components should not import page or layout definitions",
			from: { path: "^src/components" },
			to: { path: "^src/app/(page|layout)\\.tsx$" },
		},
	],
	options: {
		doNotFollow: {
			path: "node_modules",
		},
		tsPreCompilationDeps: true,
		tsConfig: {
			fileName: "tsconfig.json",
		},
		enhancedResolveOptions: {
			exportsFields: ["exports"],
			conditionNames: ["import", "require", "node", "default"],
			mainFields: ["main", "types", "typings"],
		},
		reporterOptions: {
			archi: {
				collapsePattern: "^(packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+",
			},
		},
	},
};
