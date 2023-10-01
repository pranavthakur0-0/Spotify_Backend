const SongModel = require("../models/Songs");
const UserModel = require("../models/User");
const PlaylistModel = require("../models/Playlist");

exports.searchSong = async (req, res, next) => {
    const { query } = req.params;
    const namePattern = new RegExp(query, 'i');
    const songResults = await SongModel.find({ name: namePattern });
    const artistResults = await UserModel.find({ username: namePattern });
    const playlistResults = await PlaylistModel.find({ name: namePattern });
    
    // Combine results from songs, artists, and playlists
    const combinedResults = [...songResults, ...artistResults, ...playlistResults];
    
    // Sort the combined results by relevance score
    combinedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    if (combinedResults.length === 0) {
        return res.status(200).json({ res: `No results found for ${query}` });
    } else {
        const bestResult = combinedResults[0];
        
        // Determine the type of the best result
        let bestResultType;
        if (songResults.includes(bestResult)) {
            bestResultType = 'Song';
        } else if (artistResults.includes(bestResult)) {
            bestResultType = 'Artist';
        } else if (playlistResults.includes(bestResult)) {
            bestResultType = 'Playlist';
        }
        
        const songResultsTop4 = songResults.slice(0, 4);
        const artistResultsTop4 = artistResults.slice(0, 4);
        const playlistResultsTop4 = playlistResults.slice(0, 4);
        
        let artistDetails;
        if (bestResultType === 'Song' && bestResult.artist) {
            artistDetails = await UserModel.findById(bestResult.artist);
        }
        
        return res.status(200).json({ 
            bestResult: {
                ...bestResult.toObject(),
                type: bestResultType, // Add the type property
                artistDetails: artistDetails ? artistDetails.toObject() : null // Add artist details
            },
            topSongs: songResultsTop4,
            topArtists: artistResultsTop4,
            topPlaylists: playlistResultsTop4 // Add top playlists
        });
    }
}
