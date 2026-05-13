import ContentPage from './ContentPage';

const faqs = [
  ['How long does a custom order take?', 'Most custom requests are reviewed within 24-48 hours. Production timing depends on size, material, and finishing complexity.'],
  ['Can I send my own design?', 'Yes. Use the custom order page to upload reference images and dimensions.'],
  ['Do you deliver outside Lahore?', 'Delivery can be arranged by city and order size. The team confirms logistics before production begins.'],
  ['Which materials do you use?', 'Common materials include MDF, plywood, walnut, oak, and mixed materials depending on the product and finish.'],
];

export default function FAQs() {
  return (
    <ContentPage eyebrow="Help" title="Frequently asked questions">
      {faqs.map(([question, answer]) => (
        <div key={question}>
          <h2>{question}</h2>
          <p>{answer}</p>
        </div>
      ))}
    </ContentPage>
  );
}
