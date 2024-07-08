import { Text, Button, Title } from "@mantine/core";
import { Badge } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/auth";
import { favoriteArticle, unFavoriteArticle } from "../../apis/articles";
import { formatDate } from "../../Helper/TextFormat";

export default function Feed({ feed }: { feed: any }) {
  const auth = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState<boolean>(feed.favorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(feed.favoritesCount);
  const nav = useNavigate();

  const handleFavorite = async() => {
    if (!auth.auth.logged){
      nav("/login");
    }
    setIsLoading(true);
    try {
      if (isFavorite){
        await unFavoriteArticle(feed.slug);
        setFavoriteCount(favoriteCount - 1)
      }else{
        await favoriteArticle(feed.slug);
        setFavoriteCount(favoriteCount + 1)
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  };
  return (
    <li className="list-item">
      {/* header */}
      <div className="box-flex">
        <div className="info-user">
          <Link to={`/profile/${feed.author.username}`}>
            <img
              className="user-image"
              src={feed.author.image}
              alt={feed.author.username}
            />
          </Link>
          <div className="info">
            <Text className="name">
              <Link className="Link-to" to={`/profile/${feed.author.username}`}>
                {feed.author.username}
              </Link>
            </Text>
            <Text className="date-come">
              {formatDate(new Date(feed.updatedAt))}
            </Text>
          </div>
        </div>
        <div>
          <Button
            variant={isFavorite ? "filled" : "outline"}
            color="green"
            size="xs"
            disabled={isLoading}
            onClick={()=>{handleFavorite()}}
          >
            {auth.auth.logged?(<FontAwesomeIcon icon={faHeart} />) : ("")}
            <Text size=".875rem" ml="0.2rem">
              {favoriteCount}
            </Text>
          </Button>
        </div>
      </div>
      <div className="Box-content">
        <Link to={`/article/${feed.slug}`} className="Link-to">
          <Title order={1} className="title-post">
            {feed.title}
          </Title>
        </Link>
        <Text weight={300} size={"1rem"} color="#999" mt="0.3rem" mb="1rem">
          {feed.description}
        </Text>
      </div>
      <div className="box-flex">
        <Link to={`/article/${feed.slug}`} className="Link-to link-red-more">
          Read more...
        </Link>
        <div className="list-tag">
          {feed.tagList.map((item: any, index: number) => (
            <Badge
              key={`min-tag-${index}`}
              className="tag-name"
              ml="0.4rem"
              size="xs"
              radius="md"
              variant="outline"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </li>
  );
}
