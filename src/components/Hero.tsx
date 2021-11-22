import { useEffect, useState } from "react";
import { IPost } from "../interfaces/blogPost.interface";
import MainService from "../services/main.service";

const styleSection: any  = {
	'background-image': "url('./assets/img/background.png')",
};

const Hero: React.FC<{}> = (props) => {
	const [posts, setPosts] = useState<IPost[]>();
	
  useEffect(() => {
		const fetchPosts = async () => {
      const postsData = await MainService.fetctPosts();
      console.log (postsData);
      setPosts(postsData.items);
    }
		fetchPosts();
	}, [])

	const postCard = (post: IPost) =>
		<a className="col-span-1 rounded-3xl" href={post.link}
			style={{backgroundImage: `url(${post.thumbnail})`, backgroundSize: 'cover'}}
		>
			{/* <img className="rounded-full h-24 w-24" src={post.thumbnail} /> */}
			<h1 className="font-bold">
				{post.title}
			</h1>
		</a>

	return (
		<div className="flex h-screen bg-fixed font-inter opacity-90" style={styleSection}>
			<div className="m-auto w-full grid grid-cols-5 gap-4">
				<div className="col-start-2">
					<img className="rounded-full"
						src="./assets/img/anderson.jpg"
						alt="Anderson Laverde"
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
			</div>
		</div>
	);
}
export default Hero;
