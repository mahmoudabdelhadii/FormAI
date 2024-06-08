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
  View,
  FlatListProps,
} from "react-native";
import SocialPost from "../../components/HomeFeed/SocialPost";
import { styled } from "nativewind";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { useNavigation } from "@react-navigation/core";

interface ScrollToTopContextType {
  scrollToTop: () => void;
}
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const ScrollToTopContext = createContext({ scrollToTop: () => {} });

export function useScrollToTop() {
  return useContext(ScrollToTopContext);
}
const HomeFeed = () => {
  const navigation = useNavigation();
  let url = "";
  const generateDummyPosts = (count: number) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: Math.random().toString(36).substr(2, 9), // Random ID for each new item
      userProfilePic: url,
      username: `user_${index}`,
      imageUrl: url,
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
    <StyledView className="flex-1 bg-white">
      <Header />
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
      <Footer navigation={navigation} />
    </StyledView>
  );
};

export default HomeFeed;
