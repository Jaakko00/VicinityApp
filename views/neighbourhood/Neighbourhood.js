import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import { Text, View, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import HomeHeader from "../../components/HomeHeader";

export default function NeighbourhoodView() {
  const styles = {
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    map: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      flex: 1,
    },
  };
  const mapStyle = [
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
        {
          weight: 1,
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "landscape.natural.landcover",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "landscape.natural.terrain",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#d81e5b",
        },
      ],
    },
  ];
  return (
    <View style={styles.container}>
      <HomeHeader />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
      />
    </View>
  );
}
