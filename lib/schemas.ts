import { z } from "zod";

export const PopupKeySchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, "Popup keys may only contain lowercase letters, numbers, and hyphens.");

const ImageSchema = z.object({
  src: z.string(),
  alt: z.string()
});

const CtaSchema = z.object({
  label: z.string(),
  href: z.string()
});

const HeroSchema = z.object({
  badge: z.string(),
  headline: z.string(),
  subheadline: z.string(),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema,
  image: ImageSchema,
  trustCues: z.array(z.string())
});

const HighlightSchema = z.object({
  title: z.string(),
  body: z.string(),
  icon: z.string()
});

const SectionSchema = z.object({
  id: z.string(),
  type: z.union([z.literal("features"), z.literal("cta"), z.literal("grid")]),
  headline: z.string(),
  body: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
      icon: z.string()
    })
  ),
  cta: CtaSchema.optional()
});

export const SiteSchema = z.object({
  brand: z.object({
    name: z.string(),
    tagline: z.string(),
    logo: ImageSchema
  }),
  nav: z.object({
    items: z.array(
      z.union([
        z.object({
          id: z.literal("explore"),
          label: z.string(),
          type: z.literal("dropdown"),
          children: z.array(
            z.object({
              id: PopupKeySchema,
              label: z.string(),
              href: z.string()
            })
          )
        }),
        z.object({
          id: z.string(),
          label: z.string(),
          type: z.literal("link"),
          href: z.string()
        })
      ])
    )
  }),
  footer: z.object({
    columns: z.array(
      z.object({
        title: z.string(),
        links: z.array(
          z.object({
            label: z.string(),
            href: z.string()
          })
        )
      })
    ),
    legal: z.object({
      copyright: z.string(),
      termsHref: z.string(),
      privacyHref: z.string()
    })
  }),
  routes: z.object({
    exploreIndexHref: z.string(),
    bookHref: z.string()
  }),
  landing: z.object({
    hero: HeroSchema,
    sections: z.array(SectionSchema)
  }),
  explore: z.object({
    headline: z.string(),
    body: z.string(),
    cards: z.array(
      z.object({
        popupKey: PopupKeySchema,
        title: z.string(),
        body: z.string(),
        href: z.string(),
        image: ImageSchema
      })
    )
  }),
  bookingPage: z.object({
    headline: z.string(),
    body: z.string(),
    popupLinksHeadline: z.string(),
    popupLinksBody: z.string(),
    popupLinksCtaLabel: z.string(),
    fullBookingCta: CtaSchema,
    bookingHeadline: z.string(),
    bookingBody: z.string(),
    popupLabel: z.string(),
    serviceLabel: z.string(),
    consultantLabel: z.string(),
    dateLabel: z.string(),
    timeLabel: z.string(),
    confirmLabel: z.string(),
    confirmationTitle: z.string(),
    confirmationBody: z.string(),
    missingSelection: z.string(),
    emptyService: z.string(),
    emptyConsultant: z.string(),
    recommendedLabel: z.string(),
    timeOptions: z.array(z.string())
  }),
  faqPage: z.object({
    headline: z.string(),
    body: z.string(),
    categories: z.array(
      z.object({
        title: z.string(),
        items: z.array(
          z.object({
            question: z.string(),
            answer: z.string()
          })
        )
      })
    )
  }),
  supportPage: z.object({
    headline: z.string(),
    body: z.string(),
    channels: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        description: z.string()
      })
    ),
    hours: z.array(z.string())
  }),
  uiKit: z.object({
    headline: z.string(),
    body: z.string()
  })
});

export const PopupSchema = z.object({
  popupKey: PopupKeySchema,
  name: z.string(),
  tagline: z.string(),
  theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    bg: z.string(),
    fg: z.string(),
    muted: z.string(),
    card: z.string(),
    border: z.string()
  }),
  images: z.object({
    hero: ImageSchema,
    defaultCard: ImageSchema
  }),
  nav: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        href: z.string()
      })
    )
  }),
  pages: z.object({
    info: z.object({
      hero: HeroSchema,
      about: z.object({
        headline: z.string(),
        body: z.string()
      }),
      highlights: z.array(HighlightSchema)
    }),
    services: z.object({
      headline: z.string(),
      body: z.string(),
      relatedConsultants: z.object({
        headline: z.string(),
        body: z.string(),
        emptyMessage: z.string()
      }),
      services: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          duration: z.string(),
          priceFrom: z.string(),
          image: ImageSchema,
          tags: z.array(z.string()),
          details: z.object({
            longDescription: z.string(),
            prepSteps: z.array(z.string()),
            aftercareSteps: z.array(z.string()),
            recommendedConsultants: z.array(z.string())
          }),
          consultantIds: z.array(z.string())
        })
      )
    }),
    consultants: z.object({
      headline: z.string(),
      body: z.string(),
      relatedServices: z.object({
        headline: z.string(),
        body: z.string(),
        emptyMessage: z.string()
      }),
      consultants: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          role: z.string(),
          bio: z.string(),
          image: ImageSchema,
          specialties: z.array(z.string()),
          extendedBio: z.string(),
          credentials: z.array(z.string())
        })
      )
    }),
    gallery: z.object({
      headline: z.string(),
      body: z.string(),
      items: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          caption: z.string(),
          image: ImageSchema
        })
      )
    }),
    products: z.object({
      headline: z.string(),
      body: z.string(),
      products: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.string(),
          image: ImageSchema,
          badge: z.string().optional()
        })
      )
    }),
    booking: z.object({
      headline: z.string(),
      body: z.string(),
      steps: z.array(
        z.object({
          title: z.string(),
          body: z.string()
        })
      ),
      cta: CtaSchema,
      widget: z.object({
        headline: z.string(),
        body: z.string(),
        serviceLabel: z.string(),
        consultantLabel: z.string(),
        dateLabel: z.string(),
        timeLabel: z.string(),
        confirmLabel: z.string(),
        confirmationTitle: z.string(),
        confirmationBody: z.string(),
        missingSelection: z.string(),
        emptyService: z.string(),
        emptyConsultant: z.string(),
        timeOptions: z.array(z.string())
      }),
      builder: z
        .object({
          headline: z.string(),
          body: z.string(),
          notesLabel: z.string(),
          submitLabel: z.string(),
          confirmationTitle: z.string(),
          confirmationBody: z.string(),
          currencySymbol: z.string().optional(),
          categories: z.array(
            z.object({
              id: z.string(),
              label: z.string(),
              items: z.array(
                z.object({
                  name: z.string(),
                  price: z.number(),
                  image: z.string()
                })
              )
            })
          ),
          presets: z.array(
            z.object({
              name: z.string(),
              description: z.string(),
              price: z.number().optional()
            })
          )
        })
        .optional()
    })
  })
});

export type SiteConfig = z.infer<typeof SiteSchema>;
export type PopupConfig = z.infer<typeof PopupSchema>;
