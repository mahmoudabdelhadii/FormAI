import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import SettingsModal from "../Screens/SettingsModal";

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
  ],
  achievements: [
    { id: "1", title: "First 200 lbs Squat", date: "2023-01-01" },
    { id: "2", title: "First 150 lbs Bench Press", date: "2023-02-01" },
  ],
  leaderboards: [
    { community: "Community A", position: 1 },
    { community: "Community B", position: 3 },
  ],
};

const Tab = createMaterialTopTabNavigator();

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledFlatList = styled(FlatList);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);

const PostsTab: React.FC = () => {
  const renderPost: ListRenderItem<Post> = ({ item }) => (
    <StyledView className="flex-1 m-1 items-center">
      <StyledImage
        source={{ uri: item.image }}
        className="w-24 h-24 rounded-md"
      />
      {item.public ? (
        <StyledText className="text-xs text-center text-copy">
          {user.name}
        </StyledText>
      ) : (
        <StyledText className="text-xs text-center text-copy">
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
    <StyledView className="p-2 border-b border-border">
      <StyledText className="text-lg font-bold text-primary">
        {item.community}
      </StyledText>
      <StyledText className="text-sm text-copy-light">
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
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const renderHeader = useMemo(
    () => (
      <StyledView>
        <StyledView className="items-center mb-4">
          <StyledImage
            source={{ uri: user.profilePicture }}
            className="w-24 h-24 rounded-full mb-2"
          />
          <StyledText className="text-2xl font-bold text-primary-dark">
            {user.name}
          </StyledText>
          <StyledText className="text-base text-copy text-center">
            {user.bio}
          </StyledText>
        </StyledView>
        <StyledView className="mb-4">
          <StyledText className="text-xl font-bold text-primary mb-2">
            Personal Records
          </StyledText>
          <StyledText className="text-base text-copy">
            Squat: {user.records.squat}
          </StyledText>
          <StyledText className="text-base text-copy">
            Bench Press: {user.records.benchPress}
          </StyledText>
          <StyledText className="text-base text-copy">
            Deadlift: {user.records.deadlift}
          </StyledText>
        </StyledView>
        <StyledTouchableOpacity
          className="absolute top-0 right-0 m-4"
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ fontSize: 24 }}>☰</Text>
        </StyledTouchableOpacity>
        <TabsComponent />
      </StyledView>
    ),
    []
  );

  return (
    <StyledSafeAreaView className="flex-1">
      <StyledFlatList
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={null}
        keyExtractor={() => "key"}
      />
      <SettingsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </StyledSafeAreaView>
  );
};

export default ProfileTab;
