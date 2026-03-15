const faqs = [
  {
    question: 'Is EILIYAH safe for sensitive skin?',
    answer:
      'Our products are created with gentle ingredients and are designed for the external intimate area only. However, every body is unique, so we always recommend a small patch test first.'
  },
  {
    question: 'Can I use MUMSY products postpartum or during breastfeeding?',
    answer:
      'Many women choose gentle intimate-care routines during postpartum. Because every recovery and medical history is different, please speak with your healthcare provider before introducing any new product.'
  },
  {
    question: 'Do you offer discreet packaging?',
    answer:
      'Yes. Orders are packed in plain, unbranded outer packaging so that your purchase remains private.'
  },
  {
    question: 'Does this cream permanently change skin colour?',
    answer:
      'No. Our brightening products are designed to support a more even-looking tone and hydrated appearance over time. They are not medical treatments and do not permanently change your natural skin colour.'
  },
  {
    question: 'What is your returns policy?',
    answer:
      'For hygiene reasons, we are only able to accept returns on unopened, unused products within a limited time window. Please refer to the full policy in our footer for details.'
  }
];

export const metadata = {
  title: 'FAQ • EILIYAH Intimate Care'
};

export default function FaqPage() {
  return (
    <div className="container-page py-10 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
        FREQUENTLY ASKED QUESTIONS
      </p>
      <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
        Your questions, answered with care.
      </h1>
      <p className="mt-4 text-sm text-mumsy-dark/80">
        If you cannot find your answer here, our team is happy to support you
        privately through WhatsApp.
      </p>

      <div className="mt-6 space-y-4">
        {faqs.map((faq) => (
          <article
            key={faq.question}
            className="rounded-2xl bg-white border border-mumsy-lavender/40 p-4"
          >
            <h2 className="text-sm font-semibold text-mumsy-dark">
              {faq.question}
            </h2>
            <p className="mt-1 text-sm text-mumsy-dark/80">{faq.answer}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

