# C# Dev Kit for Visual Studio Code

This repository is where we (Microsoft) gather and interact with the community around the [C# Dev Kit extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit) for Visual Studio Code. To report an issue here, ideally you would use the 'Report an Issue' capability within VS Code which will log an issue in this repository for us to triage and keep updated.

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Triage

When triaging issues in this repo teams are expected to follow the [triage guidelines](TRIAGE.md).

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
Assets/
 ├── Scenes/
 │    └── DarkEnding.unity
 ├── Scripts/
 │    ├── DarkEndingManager.cs
 │    ├── GateTap.cs
 │    └── FakeCrash.cs
 ├── Audio/
 │    ├── whisper.mp3
 │    ├── heartbeat.mp3
 │    └── glitch.mp3
 └── UI/
      └── DarkText.prefab
using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class DarkEndingManager : MonoBehaviour
{
    public Image blackScreen;
    public Text endingText;
    public AudioSource audioSource;
    public AudioClip whisper;
    public AudioClip heartbeat;

    void Start()
    {
        StartCoroutine(StartEnding());
    }

    IEnumerator StartEnding()
    {
        audioSource.clip = heartbeat;
        audioSource.loop = true;
        audioSource.Play();

        yield return new WaitForSeconds(2f);

        audioSource.PlayOneShot(whisper);
        yield return FadeToBlack();

        endingText.text = "The gate was never inside the building...";
        yield return new WaitForSeconds(2f);

        endingText.text = "It was inside you.";
        yield return new WaitForSeconds(2f);

        endingText.text = "YOU ARE STILL HERE";
    }

    IEnumerator FadeToBlack()
    {
        for (float i = 0; i <= 1; i += Time.deltaTime / 3)
        {
            blackScreen.color = new Color(0,0,0,i);
            yield return null;
        }
    }
}using UnityEngine;

public class GateTap : MonoBehaviour
{
    int taps = 0;
    public int requiredTaps = 15;

    public void TapGate()
    {
        taps++;
        Handheld.Vibrate();

        if (taps >= requiredTaps)
        {
            UnityEngine.SceneManagement.SceneManager
                .LoadScene("DarkEnding");
        }
    }
}using UnityEngine;
using System.Collections;

public class FakeCrash : MonoBehaviour
{
    void Start()
    {
        StartCoroutine(CrashEffect());
    }

    IEnumerator CrashEffect()
    {
        Time.timeScale = 0f;
        yield return new WaitForSecondsRealtime(3f);
        Time.timeScale = 1f;
    }
}PlayerPrefs.SetInt("DarkEndingSeen", 1);
