import { ApprovalAction, CreateOfferAction, OfferWithSignature, TakeOfferAction } from "../src";

export const DAY_SECONDS = 60 * 60 * 24;

export async function executeCreateSteps(steps: (CreateOfferAction | ApprovalAction)[]): Promise<OfferWithSignature> {
  let output: OfferWithSignature | null = null;
  for (const step of steps) {
    if (step.type === "approval") {
      await step.approve();
    } else if (step.type === "create") {
      output = await step.create();
    }
  }

  const { offer, signature } = output || {};

  if (!offer || !signature) {
    throw new Error("Offer not created");
  }

  return { offer, signature };
}

export async function executeTakeSteps(steps: (TakeOfferAction | ApprovalAction)[]): Promise<string> {
  let txnHash: string | null = null;
  for (const step of steps) {
    if (step.type === "approval") {
      await step.approve();
    } else if (step.type === "take") {
      txnHash = await step.take();
    }
  }

  if (!txnHash) {
    throw new Error("Offer not taken");
  }

  return txnHash;
}