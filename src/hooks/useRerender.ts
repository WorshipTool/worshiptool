import React from "react";

// Returns a function that can be called to force a rerender of the component that calls it.
export const useRerender = () => {
	const [, setRerender] = React.useState({});
	return () => setRerender({});
};
