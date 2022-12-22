import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import moment from "moment";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import CommentModal from "../../comment/CommentModal";
import PreviewImage from "./PreviewImage";

export default function PostCard(props) {
  const { theme } = useContext(ThemeContext);
  const { user, setUser, approvedFriends } = useContext(
    AuthenticatedUserContext
  );
  const { userInfo, setUserInfo } = useContext(AuthenticatedUserContext);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [likedBy, setLikedBy] = useState([]);
  const [dislikedBy, setDislikedBy] = useState([]);
  const [friendCommented, setFriendCommented] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const styles = {
    card: {
      backgroundColor: "#fff",
      padding: 10,

      borderRadius: 10,
      minWidth: "95%",
      maxWidth: "95%",

      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    backCard: {
      position: "absolute",
      bottom: 0,
      zIndex: -1,
      backgroundColor: theme.colors.primary,
      height: friendCommented.length ? "94%" : "100%",
      minWidth: "100%",
      maxWidth: "95%",
      padding: 10,
      borderRadius: 10,

      transform: [{ rotate: "-3deg" }],
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    cardPinned: {
      backgroundColor: "#fff",
      padding: 10,

      borderRadius: 10,
      minWidth: "95%",
      maxWidth: "95%",

      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    cardHeader: {
      flexDirection: "row",
    },
    cardHeaderText: {
      margin: 5,
      padding: 5,
      borderLeftWidth: 2,
      borderColor: "#E40066",
      flex: 1,
    },
    cardHeaderTextOwn: {
      margin: 5,
      padding: 5,
      borderLeftWidth: 2,
      borderColor: "#276fbf",
      flex: 1,
    },
    cardFirstRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    scrollView: {
      maxHeight: 200,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      padding: 5,
      overflow: "hidden",
      backgroundColor: "white",
    },
    shadowProp: {
      padding: 7,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    text: {
      fontFamily: "Futura",
      color: "#7a7a7a",
    },
    textDelete: {
      fontFamily: "Futura",
      color: "red",
    },
    textPrimary: {
      fontFamily: "Futura",
      backgroundColor: "#fff",
      fontSize: 16,
    },
    textHeader: {
      fontFamily: "Futura",
      fontSize: 16,
    },
    cardActionRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 10,
    },
    cardActionButton: {
      margin: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    cardActionNumber: {
      fontFamily: "Futura",
      width: 30,
      textAlign: "center",
    },
    commentInfoContainer: {
      flexDirection: "row",
      width: "90%",
    },
  };

  

  useEffect(() => {
    if (props.post.likedBy) {
      setLikedBy(props.post.likedBy);
    }
    if (props.post.dislikedBy) {
      setDislikedBy(props.post.dislikedBy);
    }
    if (props.post.comments) {
      setFriendCommented([]);
      setComments(props.post.comments);
      const tempArray = approvedFriends.filter((friend) => {
        return props.post.comments.some((comment) => {
          return comment.uid === friend.uid;
        });
      });
      setFriendCommented(tempArray);
    }
  }, [props.post]);

  useEffect(() => {
    setIsLiked(likedBy.includes(user.uid));
    setIsDisliked(dislikedBy.includes(user.uid));
  }, [likedBy, dislikedBy]);

  const handleComment = (message) => {
    const newComment = {
      message,
      uid: user.uid,
      sentAt: Date.now(),
      id: uuid.v4(),
    };
    setComments([...comments, newComment]);
    props.updatePost(props.post.id, {
      comments: [...comments, newComment],
    });
  };

  /* 
    handles like button
    if user has already liked the post, unlike it in state and in firestore
  */
  const handleLike = () => {
    if (isLiked) {
      setLikedBy(likedBy.filter((uid) => uid !== user.uid));
      // update post in firebase
      props.updatePost(props.post.id, {
        likedBy: likedBy.filter((uid) => uid !== user.uid),
      });
    } else {
      setLikedBy([...likedBy, user.uid]);
      if (isDisliked) {
        setDislikedBy(dislikedBy.filter((uid) => uid !== user.uid));
        props.updatePost(props.post.id, {
          likedBy: [...likedBy, user.uid],
          dislikedBy: dislikedBy.filter((uid) => uid !== user.uid),
        });
      } else {
        props.updatePost(props.post.id, {
          likedBy: [...likedBy, user.uid],
        });
      }
    }
  };

  /*
    handles dislike button
    if user has already disliked the post, undislike it in state and in firestore
  */
  const handleDislike = () => {
    if (isDisliked) {
      setDislikedBy(dislikedBy.filter((uid) => uid !== user.uid));
      props.updatePost(props.post.id, {
        dislikedBy: dislikedBy.filter((uid) => uid !== user.uid),
      });
    } else {
      setDislikedBy([...dislikedBy, user.uid]);
      if (isLiked) {
        setLikedBy(likedBy.filter((uid) => uid !== user.uid));
        props.updatePost(props.post.id, {
          dislikedBy: [...dislikedBy, user.uid],
          likedBy: likedBy.filter((uid) => uid !== user.uid),
        });
      } else {
        props.updatePost(props.post.id, {
          dislikedBy: [...dislikedBy, user.uid],
        });
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete post",
      "Are you sure?",
      [
        {
          text: "Delete",
          onPress: () => props.deletePost(props.post.id),
          style: "destructive",
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      {friendCommented.length ? (
        <View style={styles.commentInfoContainer}>
          <Text style={styles.text}>
            {friendCommented[0].firstName}
            {friendCommented.length === 2
              ? ` + ${friendCommented.length - 1} friend`
              : friendCommented.length > 2
              ? ` + ${friendCommented.length - 1} friends`
              : null}{" "}
            commented
          </Text>
          <MaterialCommunityIcons
            name="arrow-down-right-bold"
            size={18}
            color={theme.colors.textSecondary}
          />
        </View>
      ) : null}

      {props.post.pinned && <View style={styles.backCard} />}
      <View style={props.post.pinned ? styles.cardPinned : styles.card}>
        <View style={styles.cardHeader}>
          <UserAvatar
            style={styles.shadowProp}
            width={55}
            image={props.post.userData.avatar}
            user={props.post.userData}
            navigation={props.navigation}
            home
          />

          <View
            style={
              props.post.userData.uid !== user.uid
                ? styles.cardHeaderText
                : styles.cardHeaderTextOwn
            }
          >
            <View style={styles.cardFirstRow}>
              <Text style={styles.textHeader}>
                {props.post.userData.uid !== user.uid
                  ? `${props.post.userData.firstName} ${props.post.userData.lastName}`
                  : "You"}
              </Text>
              {props.post.userData.uid !== user.uid ? (
                <Text style={styles.text}>
                  {parseInt(props.post.distance * 1000, 10)}m
                </Text>
              ) : (
                <TouchableOpacity onPress={handleDelete}>
                  <Text style={styles.textDelete}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.text}>
              {moment(props.post.postedAt).fromNow()}
            </Text>
          </View>
        </View>
        <View style={styles.scrollView}>
          <ScrollView>
            <Text style={styles.textPrimary}>{props.post.text}</Text>
          </ScrollView>
        </View>
        {props.post.image && (
          <PreviewImage
            width="100%"
            height={80}
            image={{ uri: props.post.image }}
          />
        )}

        <View style={styles.cardActionRow}>
          <TouchableWithoutFeedback onPress={() => setCommentModalOpen(true)}>
            <View style={styles.cardActionButton}>
              <Text style={styles.cardActionNumber}>
                {comments.length > 99 ? "99+" : comments.length}
              </Text>
              <MaterialCommunityIcons
                name="comment"
                size={24}
                color={theme.colors.textSecondary}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => handleLike()}>
            <View style={styles.cardActionButton}>
              <Text style={styles.cardActionNumber}>
                {likedBy.length > 99 ? "99+" : likedBy.length}
              </Text>
              <MaterialCommunityIcons
                name="thumb-up"
                size={24}
                color={
                  isLiked ? theme.colors.primary : theme.colors.textSecondary
                }
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handleDislike()}>
            <View style={styles.cardActionButton}>
              <Text style={styles.cardActionNumber}>
                {dislikedBy.length > 99 ? "99+" : dislikedBy.length}
              </Text>
              <MaterialCommunityIcons
                name="thumb-down"
                size={24}
                color={isDisliked ? "black" : theme.colors.textSecondary}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {commentModalOpen && (
          <CommentModal
            post={props.post}
            comments={comments}
            handleComment={handleComment}
            commentModalOpen={commentModalOpen}
            setCommentModalOpen={setCommentModalOpen}
            navigation={props.navigation}
          />
        )}
      </View>
    </>
  );
}
