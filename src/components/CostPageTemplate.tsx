import type { CostEntry } from '@/lib/types';
import { formatUSD, formatRange } from '@/lib/format';
import FAQSchema from './FAQSchema';

interface CostPageTemplateProps {
  entry: CostEntry;
}

// Generate direct answer based on cost data
function generateDirectAnswer(entry: CostEntry): string {
  const range = formatRange(entry.minCost, entry.maxCost, entry.unit);
  const topicLower = entry.topic.toLowerCase();

  if (entry.unit) {
    return `The typical cost of ${topicLower} ranges from ${range}. Actual prices vary based on your location, specific requirements, provider experience, and the scope of services included. Always get multiple quotes and compare what's included before making a decision.`;
  }

  return `The typical cost of ${topicLower} ranges from ${range}. Prices vary significantly based on your geographic location, project complexity, materials or service quality, and current market conditions. Getting multiple quotes is essential for finding the best value.`;
}

// Generate cost drivers based on topic
function generateCostDrivers(entry: CostEntry): string[] {
  const isService = entry.unit !== undefined;
  const isRecurring = entry.unit?.includes('month') || entry.unit?.includes('year');

  const baseDrivers = [
    'Geographic location and local market rates',
    'Provider experience and reputation',
    'Scope and complexity of the project or service',
  ];

  if (isRecurring) {
    return [
      ...baseDrivers,
      'Level of service and features included',
      'Contract length and payment terms',
      'Additional services or premium options',
    ];
  }

  if (isService) {
    return [
      ...baseDrivers,
      'Time and labor requirements',
      'Quality of materials or tools used',
      'Urgency and scheduling flexibility',
    ];
  }

  return [
    ...baseDrivers,
    'Material quality and brand choices',
    'Labor costs and contractor availability',
    'Permits, inspections, and regulatory requirements',
    'Project timeline and scheduling',
  ];
}

// Generate low-end breakdown
function generateLowEnd(entry: CostEntry): { cost: string; description: string } {
  const lowEndMax = Math.round(entry.minCost + (entry.maxCost - entry.minCost) * 0.25);
  const costStr = entry.unit
    ? `${formatUSD(entry.minCost)} to ${formatUSD(lowEndMax)} ${entry.unit}`
    : `${formatUSD(entry.minCost)} to ${formatUSD(lowEndMax)}`;

  const descriptions: Record<string, string> = {
    default:
      'Basic options with standard features, minimal customization, and straightforward requirements. Often involves DIY elements, off-peak timing, or newer providers building their portfolios. Suitable for budget-conscious consumers with flexible expectations.',
    service:
      'Entry-level service with standard features and limited customization. May involve newer providers, basic packages, or promotional rates. Suitable for straightforward needs without complex requirements.',
    recurring:
      'Basic tier with essential features and standard support. May have limitations on usage, features, or customization. Good starting point for those testing the service or with minimal requirements.',
  };

  let descKey = 'default';
  if (entry.unit?.includes('month') || entry.unit?.includes('year')) {
    descKey = 'recurring';
  } else if (entry.unit) {
    descKey = 'service';
  }

  return { cost: costStr, description: descriptions[descKey] };
}

// Generate high-end breakdown
function generateHighEnd(entry: CostEntry): { cost: string; description: string } {
  const highEndMin = Math.round(entry.minCost + (entry.maxCost - entry.minCost) * 0.7);
  const costStr = entry.unit
    ? `${formatUSD(highEndMin)} to ${formatUSD(entry.maxCost)}+ ${entry.unit}`
    : `${formatUSD(highEndMin)} to ${formatUSD(entry.maxCost)}+`;

  const descriptions: Record<string, string> = {
    default:
      'Premium quality with top-tier materials, experienced professionals, and comprehensive service. Includes custom features, expedited timelines, and meticulous attention to detail. Best for those prioritizing quality and long-term value over initial cost.',
    service:
      'Premium service from highly experienced providers with proven track records. Includes comprehensive deliverables, priority scheduling, and exceptional attention to detail. Ideal for complex projects or when quality is paramount.',
    recurring:
      'Full-featured tier with premium support, advanced features, and maximum customization. Often includes dedicated account management, priority service, and comprehensive coverage. Best for demanding requirements or business-critical needs.',
  };

  let descKey = 'default';
  if (entry.unit?.includes('month') || entry.unit?.includes('year')) {
    descKey = 'recurring';
  } else if (entry.unit) {
    descKey = 'service';
  }

  return { cost: costStr, description: descriptions[descKey] };
}

// Generate hidden costs
function generateHiddenCosts(entry: CostEntry): string[] {
  const isRecurring = entry.unit?.includes('month') || entry.unit?.includes('year');

  if (isRecurring) {
    return [
      'Setup or onboarding fees often charged separately',
      'Price increases after promotional periods end',
      'Additional fees for premium features or add-ons',
      'Cancellation fees or early termination penalties',
      'Transaction fees or usage-based charges',
    ];
  }

  return [
    'Permits, licenses, and inspection fees',
    'Unexpected issues discovered during the project',
    'Disposal and cleanup costs',
    'Travel or transportation charges',
    'Changes or additions requested after work begins',
    'Follow-up maintenance or adjustments',
  ];
}

// Generate "Is It Worth It?" section
function generateWorthIt(entry: CostEntry): string {
  const topicLower = entry.topic.toLowerCase();
  const isRecurring = entry.unit?.includes('month') || entry.unit?.includes('year');

  if (isRecurring) {
    return `Whether ${topicLower} is worth the ongoing investment depends on your specific situation, goals, and alternatives. Consider the time you'll save, the expertise you're accessing, and the potential return on investment. For many, the convenience and professional results justify the cost, while others may find DIY or lower-cost alternatives sufficient. Evaluate your priorities and compare several providers before committing.`;
  }

  return `Whether ${topicLower} is worth the investment depends on your individual circumstances, timeline, and priorities. Consider factors like how long you'll benefit from the results, the importance of quality versus cost savings, and your available alternatives. For many people, investing in quality pays off through better results, fewer problems, and greater satisfaction. However, budget-conscious options can work well for straightforward needs. Research thoroughly and get multiple quotes before deciding.`;
}

// Generate FAQs
function generateFAQs(entry: CostEntry): Array<{ question: string; answer: string }> {
  const topicLower = entry.topic.toLowerCase();
  const range = formatRange(entry.minCost, entry.maxCost, entry.unit);
  const isRecurring = entry.unit?.includes('month') || entry.unit?.includes('year');

  if (isRecurring) {
    return [
      {
        question: `What's the typical price range for ${topicLower}?`,
        answer: `Most people pay ${range} for ${topicLower}. Actual costs depend on your location, the provider's experience, and the specific services or features included in your package.`,
      },
      {
        question: `Can I negotiate the price of ${topicLower}?`,
        answer: `Yes, many providers offer flexibility, especially for longer commitments or bundled services. Ask about annual payment discounts, promotional rates, or customized packages that fit your budget.`,
      },
      {
        question: `What should I look for when comparing ${topicLower} providers?`,
        answer: `Compare what's included in each price tier, check reviews and references, understand cancellation policies, and ask about any additional fees. The cheapest option isn't always the best value.`,
      },
      {
        question: `Are there hidden fees I should watch out for?`,
        answer: `Common hidden costs include setup fees, price increases after promotional periods, charges for premium features, and cancellation penalties. Always ask for a complete breakdown of all costs before signing up.`,
      },
      {
        question: `How do I know if I'm getting a fair price?`,
        answer: `Get quotes from at least three providers, research market rates in your area, and read reviews from verified customers. If a price seems too good to be true, ask what's not included.`,
      },
    ];
  }

  return [
    {
      question: `How much should I budget for ${topicLower}?`,
      answer: `Budget ${range} for ${topicLower}. Your actual cost will depend on your location, project scope, materials chosen, and the providers you select. Always add 10-15% for unexpected expenses.`,
    },
    {
      question: `What factors most affect the cost of ${topicLower}?`,
      answer: `The biggest cost factors are typically your geographic location, the scope and complexity of the project, material or service quality, and the experience level of the professionals involved.`,
    },
    {
      question: `How can I save money on ${topicLower}?`,
      answer: `Get multiple quotes, be flexible on timing, consider doing some prep work yourself, and ask about payment plans or discounts. However, don't sacrifice quality for minor savings on important projects.`,
    },
    {
      question: `Should I choose the cheapest option for ${topicLower}?`,
      answer: `Not necessarily. The cheapest option may cut corners, use inferior materials, or lack proper insurance and warranties. Focus on value—quality work at a fair price—rather than the lowest bid.`,
    },
    {
      question: `How many quotes should I get for ${topicLower}?`,
      answer: `Get at least three quotes from reputable providers. This helps you understand the market rate and identify outliers. Be wary of quotes significantly below or above the average.`,
    },
  ];
}

export default function CostPageTemplate({ entry }: CostPageTemplateProps) {
  const directAnswer = generateDirectAnswer(entry);
  const costDrivers = generateCostDrivers(entry);
  const lowEnd = generateLowEnd(entry);
  const highEnd = generateHighEnd(entry);
  const hiddenCosts = generateHiddenCosts(entry);
  const worthIt = generateWorthIt(entry);
  const faqs = generateFAQs(entry);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold text-gray-900">{entry.title}</h1>

      {/* 1. Direct Answer */}
      <section className="mb-12">
        <p className="text-xl leading-8 text-gray-700">{directAnswer}</p>
      </section>

      {/* 2. What Drives the Cost */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          What Drives the Cost
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          {costDrivers.map((driver, index) => (
            <li key={index}>{driver}</li>
          ))}
        </ul>
      </section>

      {/* 3. Low-End vs High-End Breakdown */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Low-End vs High-End Breakdown
        </h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Low-End: {lowEnd.cost}
            </h3>
            <p className="text-gray-700">{lowEnd.description}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              High-End: {highEnd.cost}
            </h3>
            <p className="text-gray-700">{highEnd.description}</p>
          </div>
        </div>
      </section>

      {/* 4. Hidden Costs People Miss */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Hidden Costs People Miss
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          {hiddenCosts.map((cost, index) => (
            <li key={index}>{cost}</li>
          ))}
        </ul>
      </section>

      {/* 5. Is It Worth It? */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Is It Worth It?
        </h2>
        <p className="text-lg leading-8 text-gray-700">{worthIt}</p>
      </section>

      {/* 6. FAQs */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
        <FAQSchema faqs={faqs} topic={entry.topic} />
      </section>
    </article>
  );
}
