import ImageCompressor from "image-compressor.js";

const compressImage = async( image, isHeader ) => {
	let
		maxWidth = isHeader ? 2000 : 600,
		maxHeight = isHeader ? 2000 : 1100,
		result = { size: image.size },
		scaledImg,
		quality = .9;

	try {
		const imageCompressor = new ImageCompressor();
		scaledImg = await imageCompressor.compress( image, {
			maxWidth: maxWidth, maxHeight: maxHeight, checkOrientation: false });

		if ( scaledImg.size > 1010000 ) {
			while ( quality > 0.1 && result.size > 1010000 ) {
				result = await imageCompressor.compress( scaledImg, {
					quality: quality, checkOrientation: false });
				quality -= 0.1;
			}

			if ( result.size > 1010000 ) {
				throw Error( "The image size is too big and could not be compressed " +
				"below max size" );
			}
			return result;
		}
		return scaledImg;
	} catch ( err ) {
		console.log( err );
	}
};

export default compressImage;
