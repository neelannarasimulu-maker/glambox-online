$files = @('content\popups\hair.json','content\popups\nails.json','content\popups\wellness.json')
function Convert-Price($value) {
  if (-not $value) { return $value }
  $v = $value.Trim()
  if ($v -match '^R\s*') { return $v }
  if ($v -match '^ZAR\s*') { return ('R' + ($v -replace '^ZAR\s*', '')) }
  if ($v -match '^\$') { return ('R' + ($v -replace '^\$', '')) }
  return ('R' + $v)
}

$serviceDetails = @{
  hair = @{
    'signature-cut' = @{ longDescription = 'A precision cut tailored to your face shape, hair density, and lifestyle. Includes a full consultation, sectioned shaping, and a finish that matches your desired movement and texture.'; prepSteps = @('Arrive with clean, detangled hair for accurate assessment.','Bring a few reference photos to align on length and shape.','Avoid heavy oils or styling products on the day of service.'); aftercareSteps = @('Wait 24 hours before heavy heat styling.','Use a lightweight leave-in to maintain softness.','Book a maintenance trim every 6 to 8 weeks.'); recommendedConsultants = @('Noah Rivera','Kai Alvarez') }
    'color-glow' = @{ longDescription = 'A custom color placement with dimensional shine and toning for a high-gloss finish. Ideal for refreshing tone or adding depth while preserving hair health.'; prepSteps = @('Share any previous color history during consultation.','Arrive with dry hair for more accurate tone mapping.','Avoid oil treatments for 48 hours beforehand.'); aftercareSteps = @('Wait 48 hours before your first wash.','Use sulfate-free, color-safe shampoo.','Schedule a gloss refresh every 6 to 8 weeks.'); recommendedConsultants = @('Amara Chen','Sienna Patel') }
    'repair-ritual' = @{ longDescription = 'Bond-repair therapy paired with scalp massage and hydration to restore strength and elasticity. Best for color-treated or heat-stressed hair.'; prepSteps = @('Skip heavy styling products on the day of service.','Let your stylist know about any scalp sensitivity.','Bring your current product list for best recommendations.'); aftercareSteps = @('Limit heat styling for the next 72 hours.','Use a weekly bond-repair mask.','Hydrate with a lightweight leave-in between washes.'); recommendedConsultants = @('Sienna Patel','Noah Rivera') }
    'blowout-ritual' = @{ longDescription = 'A signature blowout that focuses on smoothness, body, and long-lasting finish. Includes heat protection and finishing gloss for shine.'; prepSteps = @('Arrive with clean, towel-dried hair if possible.','Share your preferred volume and texture goals.','Remove heavy hair accessories before service.'); aftercareSteps = @('Use a silk wrap or loose bun overnight.','Avoid moisture and steam for 24 hours.','Refresh with a lightweight dry spray if needed.'); recommendedConsultants = @('Kai Alvarez','Noah Rivera') }
    'texture-reset' = @{ longDescription = 'A curl-defining treatment with customized moisture balance and shaping to enhance natural texture. Ideal for curls, coils, and waves.'; prepSteps = @('Arrive with hair in its natural state, if possible.','Avoid heavy oils the day before.','Share your typical wash-and-go routine.'); aftercareSteps = @('Use curl-friendly, sulfate-free products.','Diffuse on low heat or air dry.','Refresh midweek with a water-based mist.'); recommendedConsultants = @('Sienna Patel','Noah Rivera') }
  }
  nails = @{
    'signature-mani' = @{ longDescription = 'A signature manicure with detailed cuticle care, shaping, buffing, and high-gloss polish. Perfect for a clean, classic finish.'; prepSteps = @('Remove gel or acrylic 24 hours before if possible.','Bring inspiration photos if you want a specific finish.','Avoid hand oils right before the appointment.'); aftercareSteps = @('Apply cuticle oil nightly for 5 days.','Wear gloves for cleaning and hot water tasks.','Book a refresh every 2 to 3 weeks.'); recommendedConsultants = @('Mira Lopez','Rhea Singh') }
    'gel-artist' = @{ longDescription = 'A gel extension set with custom art detailing and durable shine. Includes shaping, layering, and a protective top coat.'; prepSteps = @('Arrive with clean nails and no polish.','Share your preferred length and shape.','Bring reference art if you want a specific look.'); aftercareSteps = @('Avoid hot water for 4 hours after service.','Use cuticle oil to keep the set flexible.','Schedule a fill every 2 to 3 weeks.'); recommendedConsultants = @('Mira Lopez','Jules Martin') }
    'spa-pedi' = @{ longDescription = 'A restorative pedicure with exfoliation, massage, and polish. Designed for softness, circulation, and a polished finish.'; prepSteps = @('Wear open-toe shoes after the appointment.','Avoid shaving 24 hours before service.','Share any sensitivity or concerns with your consultant.'); aftercareSteps = @('Moisturize feet daily for 7 days.','Avoid tight shoes for 24 hours.','Reapply top coat midweek for added shine.'); recommendedConsultants = @('Hana Okafor','Rhea Singh') }
    'builder-gel' = @{ longDescription = 'A structured builder gel overlay that adds strength and clean architecture. Ideal for durability with a natural look.'; prepSteps = @('Arrive with natural nails free of polish.','Share your desired length and shape goals.','Avoid lotions right before service.'); aftercareSteps = @('Avoid hard impact for 24 hours.','Use cuticle oil to prevent lifting.','Book a fill every 3 weeks.'); recommendedConsultants = @('Rhea Singh','Mira Lopez') }
    'express-refresh' = @{ longDescription = 'A quick polish refresh with light prep and shaping. Perfect between full services.'; prepSteps = @('Arrive with clean nails, no polish if possible.','Bring your preferred color or finish reference.','Let us know if you need additional repair.'); aftercareSteps = @('Avoid heat and water for 2 hours.','Apply cuticle oil every other day.','Refresh in 1 to 2 weeks for best results.'); recommendedConsultants = @('Hana Okafor','Jules Martin') }
  }
  wellness = @{
    'hydra-facial' = @{ longDescription = 'A deep-cleansing facial with targeted hydration and glow-boosting serums. Includes gentle exfoliation and a calming mask.'; prepSteps = @('Avoid retinol or strong acids for 48 hours.','Arrive makeup-free if possible.','Hydrate well the day before your visit.'); aftercareSteps = @('Avoid direct sun for 24 hours.','Use gentle cleanser and SPF daily.','Skip exfoliants for 3 days.'); recommendedConsultants = @('Leila Hart','Yasmin Reed') }
    'recovery-ritual' = @{ longDescription = 'A guided recovery session combining compression, stretch, and breathwork for muscle reset and circulation.'; prepSteps = @('Wear comfortable, flexible clothing.','Arrive 10 minutes early to settle in.','Share any injuries or sensitivities upfront.'); aftercareSteps = @('Hydrate well for the next 24 hours.','Take a gentle walk later in the day.','Schedule follow-ups weekly for best results.'); recommendedConsultants = @('Dante Flores','Marco Lee') }
    'led-glow' = @{ longDescription = 'A calming LED session designed to support clarity and glow. Includes a soothing mask and scalp relaxation.'; prepSteps = @('Avoid heavy makeup and sunscreen before arrival.','Share any recent skin treatments with your guide.','Arrive a few minutes early for a skin assessment.'); aftercareSteps = @('Use a hydrating serum that evening.','Avoid harsh exfoliation for 48 hours.','Wear SPF daily for the week following.'); recommendedConsultants = @('Leila Hart','Yasmin Reed') }
    'lymphatic-sculpt' = @{ longDescription = 'A gentle lymphatic massage focused on de-puffing and sculpting. Supports circulation, tone, and overall recovery.'; prepSteps = @('Hydrate well the day before your session.','Wear comfortable clothing and avoid heavy meals.','Share any swelling concerns or goals.'); aftercareSteps = @('Drink plenty of water post-session.','Avoid alcohol for 24 hours.','Light movement supports continued drainage.'); recommendedConsultants = @('Dante Flores','Yasmin Reed') }
    'sound-reset' = @{ longDescription = 'A restorative sound bath with guided breathwork and calming oils to support nervous system reset.'; prepSteps = @('Arrive in comfortable clothing.','Eat a light meal beforehand.','Silence devices to stay grounded.'); aftercareSteps = @('Take 10 minutes of quiet rest afterward.','Hydrate and avoid caffeine for a few hours.','Journal reflections to track progress.'); recommendedConsultants = @('Marco Lee','Dante Flores') }
  }
}

$consultantDetails = @{
  hair = @{
    'amara' = @{ extendedBio = 'Amara leads color strategy for the atelier, specializing in dimensional blends, glossing, and tone mapping. Her consultations focus on lifestyle, maintenance comfort, and long-term hair health.'; credentials = @('Color theory certification','Advanced glossing','Bond-repair systems') }
    'noah' = @{ extendedBio = 'Noah is a precision cutting specialist known for wearable shapes and clean architecture. He works with texture, growth patterns, and density to craft movement that lasts.'; credentials = @('Precision cutting','Texture shaping','Editorial styling') }
    'sienna' = @{ extendedBio = 'Sienna focuses on restorative hair rituals and scalp therapy. Her approach blends gentle care, science-backed treatments, and customized at-home plans.'; credentials = @('Scalp therapy','Bond repair','Hydration protocols') }
    'kai' = @{ extendedBio = 'Kai specializes in elevated styling and event-ready finishes. From smooth blowouts to textured updos, Kai builds looks that hold up beautifully.'; credentials = @('Event styling','Blowout mastery','Texture finishing') }
  }
  nails = @{
    'mira' = @{ extendedBio = 'Mira leads the art direction for Nail Studio with a focus on precision detail, chrome finishes, and custom sets. She is known for balancing bold creativity with clean structure.'; credentials = @('Gel extensions','Chrome art','Advanced detailing') }
    'hana' = @{ extendedBio = 'Hana is a nail care specialist who prioritizes nail health, strength, and recovery. She designs rituals that keep nails resilient between services.'; credentials = @('Cuticle care','Recovery rituals','Spa pedicures') }
    'jules' = @{ extendedBio = 'Jules collaborates on seasonal color stories and art direction. Their work blends trend forecasting with clean, modern design.'; credentials = @('Color theory','Trend forecasting','Graphic art') }
    'rhea' = @{ extendedBio = 'Rhea is known for sculpted shapes and minimal finishes. She specializes in durability-focused sets with refined structure.'; credentials = @('Builder gel','Sculpted shapes','Minimal art') }
  }
  wellness = @{
    'leila' = @{ extendedBio = 'Leila is a skin therapist specializing in hydration and barrier support. She tailors treatments to seasonal changes and long-term skin goals.'; credentials = @('Hydration therapy','LED treatments','Masking protocols') }
    'dante' = @{ extendedBio = 'Dante is a recovery coach who blends compression therapy, guided stretch, and breathwork. His sessions prioritize balance, circulation, and calm.'; credentials = @('Recovery coaching','Breathwork','Compression therapy') }
    'yasmin' = @{ extendedBio = 'Yasmin designs personalized wellness rituals that integrate skincare and recovery. She brings structure and clarity to long-term care plans.'; credentials = @('Ritual planning','Glow therapy','Recovery programs') }
    'marco' = @{ extendedBio = 'Marco is a mindfulness guide specializing in nervous-system reset and sound therapy. His sessions emphasize grounding and restorative calm.'; credentials = @('Sound baths','Mindfulness','Meditation coaching') }
  }
}

foreach ($file in $files) {
  $data = Get-Content $file -Raw | ConvertFrom-Json
  $popup = $data.popupKey
  foreach ($service in $data.pages.services.services) {
    $service.priceFrom = Convert-Price $service.priceFrom
    $details = $serviceDetails[$popup][$service.id]
    if ($null -eq $details) {
      $details = @{ longDescription = $service.description; prepSteps = @('Arrive 5-10 minutes early.','Share your goals during consultation.','Avoid heavy products before your visit.'); aftercareSteps = @("Follow your consultant's care plan.","Use recommended products.","Book a follow-up in 4-6 weeks."); recommendedConsultants = @() }
    }
    $service | Add-Member -NotePropertyName details -NotePropertyValue $details -Force
  }
  foreach ($consultant in $data.pages.consultants.consultants) {
    $details = $consultantDetails[$popup][$consultant.id]
    if ($null -eq $details) {
      $details = @{ extendedBio = $consultant.bio; credentials = @() }
    }
    $consultant | Add-Member -NotePropertyName extendedBio -NotePropertyValue $details.extendedBio -Force
    $consultant | Add-Member -NotePropertyName credentials -NotePropertyValue $details.credentials -Force
  }
  foreach ($product in $data.pages.products.products) {
    $product.price = Convert-Price $product.price
  }
  $json = $data | ConvertTo-Json -Depth 25
  [IO.File]::WriteAllText($file, $json, [Text.UTF8Encoding]::new($false))
}
