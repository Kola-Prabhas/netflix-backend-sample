import { fetchFromTMDB } from "../services/tdmb.service.js";

export const getTrendingTV = async (req, res) => {
	try {
		const data = await fetchFromTMDB(
			"https://api.themoviedb.org/3/trending/tv/day"
		);
		const randomTvShow =
			data.results[Math.floor(Math.random() * data.results?.length)];
		res.json({ success: true, content: randomTvShow });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error in get Trending TV shows controller.",
		});
	}
};

export const getTvShowTrailer = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/tv/${id}/videos`
		);
		res.json({ success: true, trailers: data.results });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}
		res.status(500).json({
			success: false,
			message: "Internal server Error in get Trailer of TV Show controller.",
		});
	}
};

export const getTvShowDetails = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}`);
		res.json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}
		res.status(500).json({
			success: false,
			message: "Internal server Error in get Details of TV Show controller.",
		});
	}
};

export const getSimilarTvShows = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/tv/${id}/similar`
		);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error in get Similar TV Shows controller.",
		});
	}
};

export const getTvShowsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(
			`https://api.themoviedb.org/3/tv/${category}`
		);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server Error in get TV Shows by category controller.",
		});
	}
};