using UnityEngine;
using UnityEngine.UI;

namespace Lean.Touch
{
	// This script will tell you which direction you swiped in
	public class LeanSwipeDirection4 : MonoBehaviour
	{
		// [Tooltip("The text element we will display the swipe information in")]
		// public Text InfoText;
	
		protected virtual void OnEnable()
		{
			// Hook into the events we need
			LeanTouch.OnFingerSwipe += OnFingerSwipe;
		}
	
		protected virtual void OnDisable()
		{
			// Unhook the events
			LeanTouch.OnFingerSwipe -= OnFingerSwipe;
		}
	
		public void OnFingerSwipe(LeanFinger finger)
		{
			// Store the swipe delta in a temp variable
			var swipe = finger.SwipeScreenDelta;

			if (swipe.x < -Mathf.Abs(swipe.y))
			{
				print ("You swiped left!");
				characterTurn (true);
			}

			if (swipe.x > Mathf.Abs(swipe.y))
			{
				print ("You swiped right!");
				characterTurn (false);
			}

			if (swipe.y < -Mathf.Abs(swipe.x))
			{
				print ("You swiped down!");
			}

			if (swipe.y > Mathf.Abs(swipe.x))
			{
				print ("You swiped up!");
			}
		}

		private void characterTurn(bool left) {
			GameObject warrior = GameObject.Find ("warrior");
			if (warrior != null) {
				warrior.GetComponent<CharacterController> ().turn(left);
			}
		}
	}
}