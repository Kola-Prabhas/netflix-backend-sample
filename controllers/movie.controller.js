import { fetchFromTMDB } from "../services/tdmb.service.js";

export const getTrendingMovies = async (req, res) => {
	try {
		const data = await fetchFromTMDB(
			"https://api.themoviedb.org/3/trending/movie/day"
		);

		const randomMovie =
			data.results[Math.floor(Math.random() * data.results?.length)];

		res.json({ success: true, content: randomMovie });
	} catch (error) {
		// console.log('error ', error);
		res.status(500).json({
			success: false,
			message: "Internal server Error in trending movies controller.",
		});
	}
};

export const getMovieTrailers = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/movie/${id}/videos`
		);
		res.json({ success: true, trailers: data.results });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}
		res.status(500).json({
			success: false,
			message: "Internal server Error in trailer of movies controller.",
		});
	}
};

export const getMovieDetails = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/movie/${id}`
		);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}
		res.status(500).json({
			success: false,
			message: "Internal server Error in details of movies controller.",
		});
	}
};

export const getSimilarMovies = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/movie/${id}/similar`
		);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}
		res.status(500).json({
			success: false,
			message: "Internal server Error in similar movies controller.",
		});
	}
};

export const getMoviesByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/movie/${category}`
		);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		console.log('error ', error);
		res.status(500).json({
			success: false,
			message:
				"Internal server Error in getting movies by category controller.",
		});
	}
};