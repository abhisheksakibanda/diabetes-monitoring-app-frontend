import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { firebase } from "../config";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ClearFoodCart } from "../redux/actions/actionTypes";
import ProgressBar from "react-native-progress/Bar";
import { BASE_URL } from "@env";
import Trends from './trends';

const screenWidth = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [totalCarbs, setTotalCarbs] = useState([]);
  const [carbsConsumed, setCarbsConsumed] = useState(0);
  const totalCarbsGoal = 150;

  const formattedDate = new Date().toLocaleDateString("en-GB");

  useFocusEffect(
    React.useCallback(() => {
      const user = firebase.auth().currentUser;
      dispatch(ClearFoodCart());
      getCarbsDetails(user?.uid);
    }, [])
  );

  useEffect(() => {
    let count = 0;
    count = count + getTotalCarbsNum("Breakfast") + getTotalCarbsNum("Lunch") + getTotalCarbsNum("Dinner");
    setCarbsConsumed(count);
  }, [totalCarbs]);

  const addFoodLog = tag => {
    navigation.navigate("ViewFoodItem", { tag: tag });
  };

  const getCarbsDetails = async user => {
    await axios.get(`${BASE_URL}/api/homeScreenCarbDetails?userId=${firebase.auth().currentUser?.uid}`)
      .then(res => setTotalCarbs(res.data?.length > 0 ? res?.data : []))
      .catch(e => console.log("Error: ", e));
  };

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const fetchUserData = async () => {
      if (user) {
        const uid = user.uid;
        console.log("UIDD: ", uid);
        const userDocRef = firebase.firestore().collection("users").doc(uid);
        const userProfRef = firebase
          .firestore()
          .collection("userProfile")
          .doc(uid);

        const userDoc = await userDocRef.get();
        const userProf = await userProfRef.get();

        if (userDoc.exists) {
          const user = { uid };
          dispatch({ type: "Login", payload: user });
          const userData = userDoc.data();
          dispatch({
            type: "userData",
            payload: { userData },
          });
        } else {
          console.log("User data not found.");
        }

        if (userProf.exists) {
          const userProfData = userProf.data();
          dispatch({
            type: "userProfileData",
            payload: { userProfData },
          });
        } else {
          console.log("User Prof data data not found.");
        }
      }
    };
    fetchUserData();
    getCarbsDetails(user?.uid);
  }, []);

  const getTotalCarbsNum = tag => {
    let carbs = totalCarbs?.find(x => x.mealType === tag)?.totalCarbs;
    return Number(carbs > 0 ? carbs.toFixed(2) : 0);
  };

  const getProgressBarPercentage = () => carbsConsumed > 0 && totalCarbsGoal > 0 ?
    carbsConsumed / totalCarbsGoal : 0;

  const progressColor = carbsConsumed / totalCarbsGoal >= 0.9 ?
    "#ff0000" : carbsConsumed / totalCarbsGoal >= 0.7 ?
      "#ffa500" : "#1356ba";
  const backgroundColor = "#e0e0e0";

  const MealButton = ({ mealType }) => (
    <TouchableOpacity
      style={[styles.mealButton, mealType === "Breakfast" ?
        styles.breakfastButton : mealType === "Lunch" ?
          styles.lunchButton : styles.dinnerButton]}
      onPress={() => addFoodLog(mealType)}>
      <View style={styles.mealButtonContent}>
        <Text style={styles.mealTypeText}>{mealType}</Text>
        <Text style={styles.carbsText}>Carbs Consumed - {getTotalCarbsNum(mealType)}g</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.homeContainer}>
        <Text style={styles.dateText}>Today</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={getProgressBarPercentage()}
            width={screenWidth * 0.25} // Adjust width to fit within 40% of total screen width
            height={20}
            color={progressColor}
            unfilledColor={backgroundColor}
            borderWidth={0}
            borderRadius={10}
          />
          <Text style={styles.progressText}>CARBS: {carbsConsumed.toFixed(2)}/{totalCarbsGoal.toFixed(2)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <MealButton mealType="Breakfast" />
          <MealButton mealType="Lunch" />
          <MealButton mealType="Dinner" />
        </View>
      </View>
      <Trends style={{ flex: 1.5 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  homeContainer: {
    flex: 0.4,  // Ensure this component only uses 40% of the screen width
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: "10%",
    padding: 16,
    backgroundColor: "#f0f4f7",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  date: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 20,
  },
  progressBarContainer: {
    width: "100%", // Ensure the progress bar does not exceed the width of the home container
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Adjust this to manage spacing and prevent overlap
    width: "100%", // Ensure buttons are within the confines of the home container
  },
  mealButton: {
    flex: 1, // Equal distribution among buttons
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10, // Increase horizontal margin to create more space between buttons
    padding: 15, // Adjust padding as needed for visual appearance
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mealButtonContent: {
    alignItems: "center",
  },
  breakfastButton: {
    backgroundColor: "#33AFFF",
  },
  lunchButton: {
    backgroundColor: "#3383FF",
  },
  dinnerButton: {
    backgroundColor: "#334FFF",
  },
  mealTypeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  carbsText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default HomeScreen;
