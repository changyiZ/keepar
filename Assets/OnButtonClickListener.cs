using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class OnButtonClickListener : MonoBehaviour {

	const int BODY_CHEST = 1;
	const int BODY_BACK = 2;

	const int FEATURE_TRAINING = 1;
	const int FEATURE_DISCUSS = 2;
	const int FEATURE_COURSE = 3;


	private int trainingPart = BODY_CHEST;

	public void setTrainingPart(int part) {
		print ("Training part:" + part);
		trainingPart = part;
		GameObject.Find ("warrior").GetComponent<CharacterController> ().toggleMenuShow(trainingPart);
	}

	public void onFeatureSelected(int feature) {
		print ("Body part: " + trainingPart + " | Feature: " + feature);

		AndroidJavaClass jumpUtils = new AndroidJavaClass("com.keep.hackday.demo.utils.JumpUtils");
		if (jumpUtils != null) {
			jumpUtils.CallStatic ("start", feature, trainingPart);
		}
	}
}
