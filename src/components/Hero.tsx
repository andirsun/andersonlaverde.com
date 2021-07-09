import { useEffect, useState } from "react";

const styleSection: any  = {
	'background-image': "url('./assets/img/background.png')",
};

const Hero = (props: any) => {
	const [posts, setPosts] = useState<any[]>();
	useEffect(()=>{
		const fetctPosts = async() => {
			fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@andersonlaverde')
				.then(response => response.json())
				.then(data => {
					console.log(data);
					setPosts(data.items);
				})
		}
		fetctPosts();
	},[])

	const postCard = (post: any) =>
		<div className="col-span-1 rounded-3xl"
			style={{backgroundImage: `url(${post.thumbnail})`, backgroundSize: 'cover'}}
		>
			{/* <img className="rounded-full h-24 w-24" src={post.thumbnail} /> */}
			<h1 className="font-bold">
				{post.title}
			</h1>
		</div>

	return (
		<section className="flex h-screen bg-fixed font-inter opacity-90" style={styleSection}>
			<div className="m-auto w-full grid grid-cols-5 gap-4">
				<div className="col-start-2">
					<img className="rounded-full h-60 w-60"
						src="./assets/img/anderson.jpg"
						alt="Anderson Laverde Profile"
					/>
				</div>

				<div className="col-start-3 col-span-3 ">
					
					<div className="grid grid-rows-3 grid-cols-5 grid-flow-col gap-4">
						<div className="col-span-3">
							<h1 className="text-white font-extrabold text-7xl leading-none tracking-tighter">
								Anderson Laverde Gracia 🇨🇴
								{/* <img className="rounded-full h-10 w-10" src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg" /> */}
							</h1>
						</div>
						<div className="col-span-2">
							<p className="text-white text-2xl leading-none tracking-tighter">
								CEO at <b>@Slinqer</b>, Engineer developing tech products to decrease carbon emissions🌲.
							</p>
							<h2 className="text-white text-3xl font-bold mt-10">Last Posts</h2>
						</div>
						{
							posts?.map(post => postCard(post))
						}
					</div>					
				</div>
				{/* <div className="h-64 grid grid-rows-3 grid-flow-col gap-4">
					<div>1</div>
					<div>1</div>
					<div>1</div>
					<div>1</div>
					<div>1</div>
					<div>1</div>
					<div>9</div>
					<div>9</div>
					<div>9</div>
				</div> */}
			</div>
			{/* <div className="m-auto text-center">
				<h1 className="text-5xl font-extrabold text-white  md:text-6xl shadow">
					<span>{props.t('hero.title')}</span>
					<br />
					<span className="text-green shadow">{props.t('hero.titleColored')}</span>
				</h1>
				<p className="mt-8 text-white font-semibold  sm:text-lg sm:max-w-xl sm:mx-auto md:text-2xl">
					{props.t('hero.text')}
				</p>
				<div className="mt-5 sm:mt-8 flex justify-center">
					<div className="rounded-md ">
						<a href="#contactForm"
							className="w-full gradient flex items-center justify-center mx-auto  hover:underline text-white font-inter font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow ">
							{props.t('hero.buttons.contact')}
						</a>
					</div>
				</div>
			</div> */}
		</section>
	);
}
export default Hero;
