import React, {
  useState,
  useRef,
  createContext,
  useCallback,
  useContext,
} from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Button,
  FlatListProps,
} from "react-native";
import SocialPost from "../components/SocialPost";
interface ScrollToTopContextType {
  scrollToTop: () => void;
}
const ScrollToTopContext = createContext({ scrollToTop: () => {} });

export function useScrollToTop() {
  return useContext(ScrollToTopContext);
}
const HomeFeed = () => {
  const generateDummyPosts = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: Math.random().toString(36).substr(2, 9), // Random ID for each new item
      userProfilePic: "https://example.com/profile.jpg",
      username: `user_${index}`,
      imageUrl: `https://example.com/post${index}.jpg`,
      likesCount: Math.floor(Math.random() * 100) + 10,
      caption: `Post number ${
        index + 1
      }: All day I kept thinking, 'wow, what a day!'`,
      commentsCount: Math.floor(Math.random() * 10) + 1,
    }));
  };
  const [data, setData] = useState(generateDummyPosts(20));
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateDummyPosts(20));
      setRefreshing(false);
    }, 2000);
  }, []);

  const onEndReached = useCallback(() => {
    if (!loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setData((prevData) => [...prevData, ...generateDummyPosts(10)]);
        setLoadingMore(false);
      }, 1500);
    }
  }, [loadingMore]);

  const scrollToTop = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, []);

  const renderItem = ({ item }) => <SocialPost post={item} />;

  const ListFooterComponent = () => {
    return loadingMore ? (
      <ActivityIndicator size="large" color="#000000" />
    ) : null;
  };

  const value = { scrollToTop };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef} // Attach the ref
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5} // Trigger the call earlier
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default HomeFeed;
