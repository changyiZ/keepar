using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class OnDiscussButtonClicked : MonoBehaviour {

	Animator anim;
	// Use this for initialization
	void Start () {
		anim = gameObject.GetComponentInParent<Animator>();
	}

	public void click() {
		anim.SetBool ("pressed", true);
		anim.SetBool ("pressed", false);
	}
}
