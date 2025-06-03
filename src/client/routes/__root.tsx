import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: Root,
});

function NavBar() {
	return (
		<div className="p-2 flex gap-2">
			<Link to="/" className="[&.active]:font-bold">
				Home
			</Link>{" "}
			<Link to="/profile" className="[&.active]:font-bold">
				Profile
			</Link>
			<Link to="/create-post" className="[&.active]:font-bold">
				Create Post
			</Link>
		</div>
	);
}

function Root() {
	return (
		<>
			<NavBar />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
}
