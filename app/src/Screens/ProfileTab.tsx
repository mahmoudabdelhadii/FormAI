import React, { useMemo } from "react";
import { View, Text, Image, FlatList, ListRenderItem } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { styled } from "nativewind";

interface Record {
  squat: string;
  benchPress: string;
  deadlift: string;
}

interface Post {
  id: string;
  image: string;
  public?: boolean;
  community?: string;
}

interface Achievement {
  id: string;
  title: string;
  date: string;
}

interface Leaderboard {
  community: string;
  position: number;
}

interface User {
  name: string;
  profilePicture: string;
  bio: string;
  records: Record;
  posts: Post[];
  achievements: Achievement[];
  leaderboards: Leaderboard[];
}

const user: User = {
  name: "John Doe",
  profilePicture: "https://example.com/john.jpg",
  bio: "Passionate weightlifter.",
  records: {
    squat: "200 lbs",
    benchPress: "150 lbs",
    deadlift: "250 lbs",
  },
  posts: [
    { id: "1", image: "https://example.com/lift1.jpg", public: true },
    {
      id: "2",
      image: "https://example.com/lift2.jpg",
      community: "Community A",
    },
    { id: "3", image: "https://example.com/lift3.jpg", public: true },
    // More posts...
  ],
  achievements: [
    { id: "1", title: "First 200 lbs Squat", date: "2023-01-01" },
    { id: "2", title: "First 150 lbs Bench Press", date: "2023-02-01" },
    // More achievements...
  ],
  leaderboards: [
    { community: "Community A", position: 1 },
    { community: "Community B", position: 3 },
    // More leaderboard entries...
  ],
};

const Tab = createMaterialTopTabNavigator();

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledFlatList = styled(FlatList);

const PostsTab: React.FC = () => {
  const renderPost: ListRenderItem<Post> = ({ item }) => (
    <StyledView className="flex-1 m-1 items-center">
      <StyledImage
        source={{ uri: item.image }}
        className="w-24 h-24 rounded-md"
      />
      {item.public ? (
        <StyledText className="text-xs text-center">{user.name}</StyledText>
      ) : (
        <StyledText className="text-xs text-center">
          {user.name} in {item.community}
        </StyledText>
      )}
    </StyledView>
  );

  return (
    <StyledFlatList
      data={user.posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const LeaderboardsTab: React.FC = () => {
  const renderLeaderboard: ListRenderItem<Leaderboard> = ({ item }) => (
    <StyledView className="p-2 border-b border-gray-300">
      <StyledText className="text-lg font-bold">{item.community}</StyledText>
      <StyledText className="text-sm text-gray-600">
        Position: {item.position}
      </StyledText>
    </StyledView>
  );

  return (
    <StyledFlatList
      data={user.leaderboards}
      renderItem={renderLeaderboard}
      keyExtractor={(item) => item.community}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const TabsComponent: React.FC = React.memo(() => (
  <StyledView style={{ height: 400 }}>
    <Tab.Navigator>
      <Tab.Screen name="Posts" component={PostsTab} />
      <Tab.Screen name="Leaderboards" component={LeaderboardsTab} />
    </Tab.Navigator>
  </StyledView>
));

const ProfileTab: React.FC = () => {
  const renderHeader = useMemo(
    () => (
      <StyledView>
        <StyledView className="items-center mb-4">
          <StyledImage
            source={{ uri: user.profilePicture }}
            className="w-24 h-24 rounded-full mb-2"
          />
          <StyledText className="text-2xl font-bold">{user.name}</StyledText>
          <StyledText className="text-base text-gray-600 text-center">
            {user.bio}
          </StyledText>
        </StyledView>
        <StyledView className="mb-4">
          <StyledText className="text-xl font-bold mb-2">
            Personal Records
          </StyledText>
          <StyledText className="text-base">
            Squat: {user.records.squat}
          </StyledText>
          <StyledText className="text-base">
            Bench Press: {user.records.benchPress}
          </StyledText>
          <StyledText className="text-base">
            Deadlift: {user.records.deadlift}
          </StyledText>
        </StyledView>
        <TabsComponent />
      </StyledView>
    ),
    []
  );

  return (
    <StyledFlatList
      ListHeaderComponent={renderHeader}
      data={[]}
      renderItem={null}
      keyExtractor={() => "key"}
    />
  );
};

export default ProfileTab;
