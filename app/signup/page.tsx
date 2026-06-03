import { Suspense } from "react"
import SignupClient from "../signup/SignupClient"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupClient />
    </Suspense>
  )
}