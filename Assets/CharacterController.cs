using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterController : MonoBehaviour {

	Animator anim;
	Animator menuAnim;
	GameObject mainPanel;
	GameObject searchPanel;

	// Use this for initialization
	void Start () {
		anim = GetComponent<Animator>();
		menuAnim = gameObject.transform.Find ("MenuCanvas").GetComponent<Animator>();
		mainPanel = GameObject.Find ("MainPanel");
		mainPanel.SetActive (false);
		searchPanel = GameObject.Find ("SearchingPanel");
	}

	public void show() {
		anim.SetFloat ("Speed Input", 0.3f);
	}

	public void stopMoving() {
		anim.SetFloat ("Speed Input", 0.0f);
	}

	public void walk() {
		anim.SetFloat ("Speed Input", 0.3f);
	}

	public void turn(bool left) {
		anim.SetFloat ("Rotation Input", left ? 3.0f : -3.0f);
		Invoke ("adjustTurning", 1);
	}

	// Make it 0 or 180.
	private void adjustTurning() {
		anim.SetFloat ("Rotation Input", 0.0f);
		Vector3 eulerAngles = gameObject.transform.eulerAngles;
		if (eulerAngles.y > 90f && eulerAngles.y < 270f) {
			gameObject.transform.eulerAngles = new Vector3(0f,180f,0);
		} else {
			gameObject.transform.eulerAngles = new Vector3(0f,0f,0);
		}
	}

	public void showFrontMenu(bool showing) {
		menuAnim.SetBool ("showing", showing);
	}

	public void toggleMenuShow(int trainingPart) {
		bool showing = menuAnim.GetBool ("showing");
		menuAnim.SetBool ("showing", !showing);
		mainPanel.SetActive (!showing);
	}

	public void hideMenu() {
		menuAnim.SetBool ("showing", false);
		mainPanel.SetActive (false);
	}

	public void searchingTarget(bool start) {
		searchPanel.SetActive (start);
	}
}
