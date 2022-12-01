import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import uuid from "react-native-uuid";
import { SafeAreaView, ThemeColors } from "react-navigation";
import GroupAddAvatar from "../../../components/GroupAddAvatar";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";

export default function TOSModal(props) {
  const { theme } = useContext(ThemeContext);

  const styles = {
    modalView: {
      height: "100%",
      backgroundColor: theme.colors.secondary,
      padding: theme.size.paddingBig,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    topBar: {
      backgroundColor: "white",
      width: "50%",
      height: 5,
      borderRadius: "50%",
      marginBottom: 10,
    },
    modalItem: {
      backgroundColor: "white",
      margin: 10,
      padding: theme.size.paddingSmall,
      width: "90%",
      height: "90%",
      borderRadius: theme.size.borderRadius,
    },
    modalText: {
      padding: theme.size.paddingSmall,
      paddingLeft: theme.size.paddingBig,
      fontFamily: "Futura",
      fontSize: 18,
    },
    modalInfoText: {
      padding: theme.size.paddingSmall,
      paddingLeft: theme.size.paddingBig,
      fontFamily: "Futura",
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    modalInfoTextImportant: {
      padding: theme.size.paddingSmall,
      paddingLeft: theme.size.paddingBig,
      fontFamily: "Futura",
      fontSize: 14,
      color: theme.colors.text,
    },
    modalButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      alignItems: "center",
    },
    modalButtonDisabled: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      alignItems: "center",
      opacity: 0.2,
    },
    modalButtonText: {
      color: "white",
      fontFamily: "Futura",
      fontSize: 18,
    },
    newGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    newGroupTextInput: {
      backgroundColor: "white",
      flex: 1,
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      fontSize: 18,
      fontFamily: "Futura",
    },
    textInput: {
      backgroundColor: "white",
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      fontSize: 18,
      fontFamily: "Futura",
    },
    modalImage: {
      width: 60,
      height: 60,
      margin: theme.size.margin,
    },
  };

  return (
    <Modal
      animationType="slide"
      visible={props.TOSModalVisible}
      onRequestClose={() => {
        props.setTOSModalVisible(false);
      }}
      presentationStyle="pageSheet"
    >
      <View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.topBar}
              onPress={() => props.setTOSModalVisible(false)}
            />

            <View style={styles.modalItem}>
              <Text style={styles.modalInfoText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim
                nulla aliquet porttitor lacus. Vitae justo eget magna fermentum
                iaculis eu non diam. Id faucibus nisl tincidunt eget nullam non
                nisi est. Enim tortor at auctor urna nunc id cursus. Adipiscing
                vitae proin sagittis nisl rhoncus mattis rhoncus. Eros donec ac
                odio tempor orci dapibus ultrices. At auctor urna nunc id cursus
                metus aliquam. Eget felis eget nunc lobortis mattis aliquam
                faucibus. Sagittis eu volutpat odio facilisis mauris. Faucibus
                et molestie ac feugiat sed lectus vestibulum. Sit amet risus
                nullam eget felis eget nunc lobortis mattis. Dignissim enim sit
                amet venenatis urna cursus eget nunc. Dui faucibus in ornare
                quam viverra orci. Magna fringilla urna porttitor rhoncus dolor
                purus. Velit egestas dui id ornare arcu odio. At tellus at urna
                condimentum mattis pellentesque id nibh tortor. Turpis egestas
                integer eget aliquet nibh praesent tristique. Risus sed
                vulputate odio ut. Luctus venenatis lectus magna fringilla urna
                porttitor rhoncus dolor. Orci dapibus ultrices in iaculis nunc
                sed. Massa tincidunt dui ut ornare lectus sit. Senectus et netus
                et malesuada. Donec ultrices tincidunt arcu non sodales neque
                sodales ut etiam. Sit amet risus nullam eget felis eget nunc
                lobortis mattis. Facilisis magna etiam tempor orci eu lobortis
                elementum nibh. Elit ullamcorper dignissim cras tincidunt
                lobortis feugiat vivamus. Facilisis leo vel fringilla est.
                Aliquet sagittis id consectetur purus ut faucibus pulvinar
                elementum. Ornare massa eget egestas purus viverra accumsan.
                Diam volutpat commodo sed egestas egestas fringilla. Auctor
                augue mauris augue neque gravida. Felis imperdiet proin
                fermentum leo vel orci porta non pulvinar. Sed elementum tempus
                egestas sed sed risus pretium quam. Viverra suspendisse potenti
                nullam ac tortor. Quis vel eros donec ac odio tempor. Felis eget
                velit aliquet sagittis id consectetur purus ut. Auctor neque
                vitae tempus quam. Purus non enim praesent elementum facilisis
                leo vel fringilla. Proin sed libero enim sed faucibus turpis in.
                Non consectetur a erat nam at. Ut eu sem integer vitae justo
                eget magna. Senectus et netus et malesuada. Sit amet nisl
                suscipit adipiscing bibendum. Sapien faucibus et molestie ac
                feugiat sed lectus. Sed euismod nisi porta lorem mollis aliquam
                ut. Tincidunt lobortis feugiat vivamus at augue eget arcu
                dictum. Massa sapien faucibus et molestie. Arcu non sodales
                neque sodales ut etiam. Neque vitae tempus quam pellentesque
                nec. Egestas fringilla phasellus faucibus scelerisque eleifend.
                Viverra vitae congue eu consequat ac. Quis eleifend quam
                adipiscing vitae proin sagittis nisl rhoncus. Condimentum mattis
                pellentesque id nibh tortor. Odio tempor orci dapibus ultrices
                in iaculis nunc sed. Senectus et netus et malesuada fames ac
                turpis egestas integer. Imperdiet dui accumsan sit amet. Aenean
                euismod elementum nisi quis eleifend. Accumsan lacus vel
                facilisis volutpat est velit egestas dui id. At auctor urna nunc
                id cursus metus aliquam. Sed pulvinar proin gravida hendrerit
                lectus. Mattis aliquam faucibus purus in massa tempor nec.
                Dignissim convallis aenean et tortor at risus viverra. Ornare
                arcu odio ut sem nulla pharetra diam. Sit amet facilisis magna
                etiam. Gravida dictum fusce ut placerat orci nulla pellentesque
                dignissim enim. In mollis nunc sed id semper risus. Amet mattis
                vulputate enim nulla aliquet porttitor lacus. Amet consectetur
                adipiscing elit ut aliquam purus sit. Hac habitasse platea
                dictumst quisque. Odio eu feugiat pretium nibh. Nunc mattis enim
                ut tellus elementum sagittis vitae et leo. Vel pretium lectus
                quam id leo in vitae turpis massa. Arcu cursus euismod quis
                viverra nibh cras pulvinar mattis. Quis hendrerit dolor magna
                eget est lorem ipsum dolor. Lorem ipsum dolor sit amet
                consectetur adipiscing elit. Aliquam purus sit amet luctus
                venenatis lectus magna fringilla urna. Fermentum odio eu feugiat
                pretium nibh ipsum consequat nisl. Eget egestas purus viverra
                accumsan. Eu ultrices vitae auctor eu. Orci porta non pulvinar
                neque laoreet suspendisse interdum consectetur. Netus et
                malesuada fames ac turpis egestas maecenas. Vestibulum morbi
                blandit cursus risus at. Venenatis tellus in metus vulputate eu.
                Bibendum ut tristique et egestas. Aliquam sem fringilla ut morbi
                tincidunt augue interdum velit euismod. Magna eget est lorem
                ipsum dolor sit amet consectetur adipiscing. Non nisi est sit
                amet facilisis magna. Enim ut sem viverra aliquet eget sit.
                Integer malesuada nunc vel risus commodo viverra maecenas. Non
                quam lacus suspendisse faucibus interdum. Vehicula ipsum a arcu
                cursus vitae congue mauris. Eu turpis egestas pretium aenean
                pharetra magna ac placerat. Orci nulla pellentesque dignissim
                enim sit. Purus semper eget duis at tellus at. Amet est placerat
                in egestas erat imperdiet. Ultricies integer quis auctor elit.
                At auctor urna nunc id cursus metus aliquam. Urna cursus eget
                nunc scelerisque viverra. Nibh tellus molestie nunc non blandit
                massa enim nec. Faucibus interdum posuere lorem ipsum dolor sit
                amet consectetur adipiscing. Ut faucibus pulvinar elementum
                integer enim. Faucibus turpis in eu mi bibendum neque egestas
                congue quisque. Semper viverra nam libero justo laoreet sit.
                Pulvinar elementum integer enim neque volutpat. Morbi tincidunt
                augue interdum velit euismod in. Iaculis eu non diam phasellus.
                Amet est placerat in egestas erat imperdiet sed euismod nisi.
                Rhoncus est pellentesque elit ullamcorper dignissim cras
                tincidunt lobortis feugiat. Sit amet risus nullam eget. Turpis
                in eu mi bibendum neque egestas congue quisque. Urna neque
                viverra justo nec ultrices dui sapien eget mi. Dis parturient
                montes nascetur ridiculus mus. Facilisi morbi tempus iaculis
                urna id. Pretium nibh ipsum consequat nisl. Nullam ac tortor
                vitae purus faucibus. Gravida arcu ac tortor dignissim convallis
                aenean et tortor at. Venenatis cras sed felis eget velit. Tellus
                molestie nunc non blandit massa enim nec. Praesent semper
                feugiat nibh sed pulvinar proin. Orci porta non pulvinar neque
                laoreet suspendisse interdum consectetur libero. Enim nulla
                aliquet porttitor lacus luctus accumsan tortor posuere ac. In
                pellentesque massa placerat duis ultricies lacus sed turpis
                tincidunt. Convallis posuere morbi leo urna molestie at
                elementum. Enim blandit volutpat maecenas volutpat. Aliquam
                eleifend mi in nulla posuere sollicitudin aliquam ultrices.
                Morbi tristique senectus et netus et malesuada. Massa massa
                ultricies mi quis hendrerit dolor magna. Ipsum a arcu cursus
                vitae congue. Enim lobortis scelerisque fermentum dui faucibus.
                Ultricies mi quis hendrerit dolor magna eget est. Tempus egestas
                sed sed risus pretium quam vulputate dignissim. Id leo in vitae
                turpis massa sed elementum tempus egestas. Nullam non nisi est
                sit amet. Vestibulum morbi blandit cursus risus. Iaculis eu non
                diam phasellus. In dictum non consectetur a erat nam. Duis
                tristique sollicitudin nibh sit amet. Sit amet volutpat
                consequat mauris nunc congue nisi. Erat velit scelerisque in
                dictum non consectetur a. Gravida rutrum quisque non tellus
                orci. Eros donec ac odio tempor orci dapibus. Scelerisque felis
                imperdiet proin fermentum leo vel. Volutpat sed cras ornare arcu
                dui vivamus arcu felis. Nisl rhoncus mattis rhoncus urna neque.
                Vel elit scelerisque mauris pellentesque pulvinar pellentesque
                habitant. Sit amet risus nullam eget felis eget. Fames ac turpis
                egestas sed tempus urna et pharetra pharetra.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
