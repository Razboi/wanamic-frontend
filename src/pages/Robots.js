import React, { Component } from "react";

class Robots extends Component {
	render() {
		return (
			<div>
				User-agent: *
				Disallow: /batcave

				User-agent: *
				Allow: /

				Sitemap: https://api.wanamic.com/admin/sitemap
			</div>
		);
	}
}

export default Robots;
