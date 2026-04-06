import { getUserOnboardingStatus } from "@/actions/user";

const AICoverLetterPage = async() => {
   const { isOnboarded } = await getUserOnboardingStatus();

    if (!isOnboarded) {
      redirect("/onboarding");
    }
  return (
    <div className='mt-40'>AICoverLetterPage</div>
  )
}

export default AICoverLetterPage