import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const
	Wrapper = styled.div`
		padding: 2rem;
	`,
	NavOption = styled.a`
		margin-right: 5px;
	`;


class Information extends Component {
	render() {
		const { match } = this.props;
		if ( match.params.section === "terms" ) {
			document.title = "Wanamic Terms of Service";
			return (
				<Wrapper>
					<nav>
						<NavOption href="/information/privacy">Privacy</NavOption>
						<NavOption href="/information/terms">Terms</NavOption>
						<NavOption href="/information/cookies">Cookies</NavOption>
						<NavOption href="/information/content">Content</NavOption>
						<NavOption href="/information/contact">Contact</NavOption>
						| <NavOption href="/">Home</NavOption>
					</nav>
					<h1>Terms and Conditions for Wanamic</h1>

					<h2>Introduction</h2>

					<p>These Terms and Conditions shall manage your use of our website, Wanamic accessible at https://wanamic.com/.</p>

					<p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions.</p>

					<p>You must be at least 13 years old to use this Website.</p>

					<h2>Intellectual Property Rights</h2>

					<p>Other than the content you own, under these Terms, Wanamic and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>

					<p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>

					<h2>Restrictions</h2>

					<p>You are specifically restricted from all of the following:</p>

					<ul>
						<li>publishing any Website material in any other media;</li>
						<li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
						<li>publicly performing and/or showing any Website material;</li>
						<li>using this Website in any way that is or may be damaging to this Website;</li>
						<li>using this Website in any way that impacts user access to this Website;</li>
						<li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
						<li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
						<li>using this Website to engage in any advertising or marketing.</li>
					</ul>

					<p>Certain areas of this Website are restricted from being access by you and Wanamic may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.</p>

					<h2>Your Content</h2>

					<p>In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Wanamic a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

					<p>Your Content must be your own and must not be invading any third-party’s rights. Wanamic reserves the right to remove any of Your Content from this Website at any time without notice.</p>

					<h2>No warranties</h2>

					<p>This Website is provided "as is," with all faults, and Wanamic express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

					<h2>Limitation of liability</h2>

					<p>In no event shall Wanamic, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.  Wanamic, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

					<h2>Indemnification</h2>

					<p>You hereby indemnify to the fullest extent Wanamic from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>

					<h2>Severability</h2>

					<p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>

					<h2>Variation of Terms</h2>

					<p>Wanamic is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>

					<h2>Assignment</h2>

					<p>Wanamic is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.</p>

					<h2>Entire Agreement</h2>

					<p>These Terms constitute the entire agreement between Wanamic and you in relation to your use of this Website, and supersede all prior agreements and understandings.</p>

					<h2>Governing Law & Jurisdiction</h2>

					<p>These Terms will be governed by and interpreted in accordance with the laws of the country of Spain, and you submit to the non-exclusive jurisdiction of the country and federal courts located in Spain for the resolution of any disputes.</p>

				</Wrapper>
			);
		}
		if ( match.params.section === "cookies" ) {
			document.title = "Wanamic Cookies Policy";
			return (
				<Wrapper>
					<nav>
						<NavOption href="/information/privacy">Privacy</NavOption>
						<NavOption href="/information/terms">Terms</NavOption>
						<NavOption href="/information/cookies">Cookies</NavOption>
						<NavOption href="/information/content">Content</NavOption>
						<NavOption href="/information/contact">Contact</NavOption>
						| <NavOption href="/">Home</NavOption>
					</nav>
					<h1>Cookie Policy for Wanamic</h1>

					<p>This is the Cookie Policy for Wanamic, accessible from https://wanamic.com/</p>

					<p><strong>What Are Cookies</strong></p>

					<p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.</p>

					<p>For more general information on cookies see the Wikipedia article on HTTP Cookies.</p>

					<p><strong>How We Use Cookies</strong></p>

					<p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>

					<p><strong>Disabling Cookies</strong></p>

					<p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.</p>


					<p><strong>The Cookies We Set</strong></p>

					<ul>

						<li>
							<p>Account related cookies</p>
							<p>If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.</p>
						</li>

						<li>
							<p>Login related cookies</p>
							<p>We use cookies when you are logged in so that we can remember this fact and identify you. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
						</li>

						<li>
							<p>Forms related cookies</p>
							<p>When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.</p>
						</li>

						<li>
							<p>Site preferences cookies</p>
							<p>In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.</p>
						</li>

					</ul>

					<p><strong>Third Party Cookies</strong></p>

					<p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>

					<ul>

						<li>
							<p>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</p>
							<p>For more information on Google Analytics cookies, see the official Google Analytics page.</p>
						</li>

					</ul>

					<p><strong>More Information</strong></p>

					<p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>

					<p>However if you are still looking for more information then you can contact us by email:</p>

					<ul>
						<li>Email: contact@wanamic.com</li>

					</ul>

				</Wrapper>
			);
		}
		if ( match.params.section === "contact" ) {
			document.title = "Contact - Wanamic";
			return (
				<Wrapper>
					<nav>
						<NavOption href="/information/privacy">Privacy</NavOption>
						<NavOption href="/information/terms">Terms</NavOption>
						<NavOption href="/information/cookies">Cookies</NavOption>
						<NavOption href="/information/content">Content</NavOption>
						<NavOption href="/information/contact">Contact</NavOption>
						| <NavOption href="/">Home</NavOption>
					</nav>
					<h1>Contact</h1>
					<p>You can contact us by email at <strong>contact@wanamic.com</strong></p>
				</Wrapper>
			);
		}
		if ( match.params.section === "content" ) {
			document.title = "Wanamic Content Policy";
			return (
				<Wrapper>
					<nav>
						<NavOption href="/information/privacy">Privacy</NavOption>
						<NavOption href="/information/terms">Terms</NavOption>
						<NavOption href="/information/cookies">Cookies</NavOption>
						<NavOption href="/information/content">Content</NavOption>
						<NavOption href="/information/contact">Contact</NavOption>
						| <NavOption href="/">Home</NavOption>
					</nav>
					<h1>Content Policy of Wanamic</h1>
					<p>As stated on our <a href="/information/terms">Terms and Conditions</a> Wanamic reserves the right to remove any of Your Content from this Website at any time without notice. Understanding the nature of our platform we try to provide a lot of leeway in the content that is acceptable and remove only the content that infringes our content policy.</p>
					<h2>Prohibited content</h2>
					<p>Wanamic does not allow any content that</p>
					<ul>
						<li>Is illegal</li>
						<li>Infringes the right to be forgotten</li>
						<li>Incites violence or any kind of discrimination</li>
						<li>Misuses the content alerts</li>
						<li>Is spam</li>
					</ul>
					<h2>Content alerts</h2>
					<h3>+18</h3>
					<p>Content that contains nudity, blood or profanity is required to activate the +18 alert.</p>
					<h3>Spoiler</h3>
					<p>Content containing spoilers is required to activate the spoiler alert. Spoiler descriptions can't contain anything perceived as an spoiler.</p>
				</Wrapper>
			);
		}
		document.title = "Wanamic Privacy Policy";
		return (
			<Wrapper>
				<nav>
					<NavOption href="/information/privacy">Privacy</NavOption>
					<NavOption href="/information/terms">Terms</NavOption>
					<NavOption href="/information/cookies">Cookies</NavOption>
					<NavOption href="/information/content">Content</NavOption>
					<NavOption href="/information/contact">Contact</NavOption>
					| <NavOption href="/">Home</NavOption>
				</nav>
				<h1>Privacy Policy of Wanamic</h1>

				<p>Wanamic operates the https://wanamic.com/ website, which provides the SERVICE.</p>

				<p>This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the Wanamic website.</p>

				<p>If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>

				<p>The terms used in this Privacy Policy have the same meanings as in our <a href="https://wanamic.com/information/terms">Terms and Conditions.</a></p>

				<h2>Information Collection and Use</h2>

				<p>For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.</p>

				<h2>Log Data</h2>

				<p>We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer’s Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p>

				<h2>Cookies</h2>

				<p>Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer’s hard drive.</p>

				<p>Our website uses these "cookies" to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.</p>

				<p>For more information consult our <a href="/information/cookies">Cookies Policy.</a></p>

				<h2>Service Providers</h2>

				<p>We may employ third-party companies and individuals due to the following reasons:</p>

				<ul>
					<li>To facilitate our Service;</li>
					<li>To provide the Service on our behalf;</li>
					<li>To perform Service-related services; or</li>
					<li>To assist us in analyzing how our Service is used.</li>
				</ul>

				<p>We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p>

				<h2>Security</h2>

				<p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>

				<h2>Links to Other Sites</h2>

				<p>Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

				<p>Children’s Privacy</p>

				<p>Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.</p>

				<h2>Changes to This Privacy Policy</h2>

				<p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.</p>

				<h2>Contact Us</h2>

				<p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at contact@wanamic.com.</p>
			</Wrapper>
		);
	}
}

Information.propTypes = {
	history: PropTypes.object.isRequired
};

export default Information;
