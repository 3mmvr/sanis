import React from 'react';

const TC: React.FC = () => {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--navy)', minHeight: '100vh' }}>
      <nav className="navbar" style={{ background: 'white', position: 'relative', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <a href="/" className="logo">
            <img src="/assets/logo_withoutbg.png" className="logo-icon" alt="Logo" style={{ height: '36px', width: 'auto' }} />
            <span className="logo-text" style={{ transform: 'translateY(8px)' }}>SANIS</span>
          </a>
          <div className="nav-links" style={{ display: 'flex' }}>
            <a href="/" style={{ color: 'var(--navy)', textDecoration: 'none', fontWeight: 700 }}>Home</a>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="tc-container" style={{ maxWidth: '900px', margin: '120px auto 60px', padding: '60px', background: 'white', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <h1>Terms & Privacy Policy</h1>
          <div className="tc-content" style={{ textAlign: 'justify' }}>
            <h2>1. AGREEMENT TO OUR LEGAL TERMS</h2>
            <p>Sanis is a digital platform operated by SanisTech Limited (hereafter referred to as "the Company," "we," "us," or "our").</p>
            <p>These Legal Terms (the "Terms") constitute a legally binding agreement between you, whether personally or on behalf of an entity ("you," "your"), and the Company, concerning your access to and use of the applications, websites, content, and services provided by Sanis (collectively, the "Services"). These Terms define your legal rights, obligations, and the limitations of liability inherent in your participation in the Services.</p>
            <p>By accessing, registering, or otherwise utilising the Services, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree with all of these Terms, you are expressly prohibited from using the Services and must discontinue use immediately.</p>
            
            <h3>1.1. Representation and Authority</h3>
            <p>If you access the Services on behalf of a business or legal entity, you represent and warrant that you possess the requisite legal authority to bind said entity to these Terms. In such instances, "you" and "your" shall refer to that entity.</p>
            
            <h3>1.2. Role of the Platform</h3>
            <p>You acknowledge that Sanis operates as an AI-driven HealthTech platform. Our Services utilise proprietary machine learning models and multimodal vision technology to provide automated nutritional insights. The platform functions as a digital processor where:</p>
            <ul><li>Service Users: Pet owners providing data to receive nutritional insights and preventive care information.</li></ul>
            <ul><li>AI Data Processing: When you upload images or pet health data, our AI systems record and process this information to generate personalised health insights and longitudinal reports.</li></ul>
            
            <h3>1.3. User Affirmations</h3>
            <p>By engaging with the Services, you affirm and warrant that:</p>
            <ul><li>You possess the legal capacity to enter into a binding contract.</li></ul>
            <ul><li>You will utilise the Services in compliance with all applicable laws and regulations in Hong Kong and your local jurisdiction.</li></ul>
            <ul><li>You consent to the processing of financial transactions necessary for the utilisation of premium SaaS features.</li></ul>
            <ul><li>You will strictly adhere to the comprehensive guidelines outlined in these Terms and any incorporated supplemental documents.</li></ul>
            
            <h3>1.4. Amendments and Supplemental Terms</h3>
            <p>The Company reserves the right, at its sole discretion, to modify or replace these Terms at any time. Amendments shall become effective immediately upon posting to our official domain or within the application. It is your responsibility to review these Terms periodically. Continued use of the Services following the posting of revisions signifies your acceptance of the updated Terms.</p>
            
            <h3>1.5. Disclaimer of Liability</h3>
            <p>Sanis provides data-driven insights; however, the Company disclaims all liability for any losses, damages, or disputes arising from dietary implementations or health outcomes based on platform data. You are encouraged to leverage these insights in conjunction with professional veterinary consultation.</p>

            <h2>2. PRIVACY</h2>
            <p>This section outlines the categories of personal data we collect and our methods for processing it in connection with the Services. By utilising the Platform, you consent to the collection and use of your information as described herein. This Privacy section is expressly incorporated into and forms an integral part of these Legal Terms.</p>
            
            <h3>2.1. Information We Collect</h3>
            <p>We collect the following categories of data to provide and refine our AI-driven insights:</p>
            <ul><li>Identity & Contact: Name, email address, and billing information.</li></ul>
            <ul><li>Account & Authentication: Username, profile details, and security login activity.</li></ul>
            <ul><li>Device & Usage: IP address, device identifiers, operating system, and diagnostic crash logs to ensure app stability.</li></ul>
            <ul><li>AI Input & Media: Photos of raw ingredients, pet profiles, and any files you upload for analysis.</li></ul>
            <ul><li>Pet Health Information: Pet name, breed, age, weight, and the longitudinal nutritional history generated through your use of the Services.</li></ul>
            <ul><li>Transactions: Subscription metadata and purchase history. Note that full credit card details are processed by our secure third-party payment provider; the Company does not store full card numbers.</li></ul>
            
            <h3>2.2. How We Use Your Information</h3>
            <p>We utilise your information to:</p>
            <ul><li>Operate and improve the AI Multimodal Vision and Zero-Shot Spatial Reasoning engines.</li></ul>
            <ul><li>Generate weekly, monthly, and yearly nutritional reports and "Smart Topper" recommendations.</li></ul>
            <ul><li>Personalise content based on your pet’s specific health risks and life stage.</li></ul>
            <ul><li>Maintain the security and integrity of the Platform.</li></ul>
            <ul><li>Comply with legal obligations and enforce our agreements.</li></ul>
            
            <h3>2.3. Sharing Your Information</h3>
            <p>We share information only as necessary to fulfill the Services, to support the development of the pet health industry, or as mandated by law:</p>
            <ul><li>Service Providers: Third-party vendors supporting our hosting, analytics, and payment processing.</li></ul>
            <ul><li>Pet Insight API & Industry Partners: We may utilise aggregated, pseudonymised, or de-identified datasets to provide "Pet-Insight" API services to veterinary clinics, pet insurers, and food manufacturers.</li></ul>
            <ul><li>Professional Consultation: When you explicitly choose to share your longitudinal reports with a veterinarian or clinic via the Platform.</li></ul>
            <ul><li>Legal Authorities: Where required to protect the safety, rights, or property of the Company, our users, or the public.</li></ul>
            
            <h2>3. THE SERVICES</h2>
            <h3>3.1. Nature of the Sanis Service</h3>
            <p>Sanis provides a comprehensive AI-driven health platform accessible via mobile and web applications. Our Services utilise proprietary multimodal vision technology to analyze nutritional inputs and provide automated health insights.</p>
            
            <h3>3.2. Sanis is Not a Veterinary Service</h3>
            <p>You acknowledge that the Company provides informational and preventive tools only. The Company does not provide veterinary medicine, medical diagnoses, or clinical treatments.</p>
            
            <h3>3.3. Nutritional Documentation & Longitudinal System</h3>
            <p>Our Services include a secure digital archive for pet health records. You retain ownership of all uploaded records. You grant the Company a license to utilise this data to generate your health reports and improve our AI diagnostic models.</p>
            
            <h2>4. MEMBERSHIP AND ACCESS TO SERVICE</h2>
            <p>To utilise the comprehensive features of Sanis, you must register for and maintain an active personal user account. You are solely responsible for all activities conducted through your Account and must maintain the absolute confidentiality of your password.</p>
            
            <h2>5. ACCOUNT HOLDER CONDUCT</h2>
            <p>You must not upload or distribute any content that misrepresents input, contains malicious code, infringes intellectual property, or is offensive or illegal. Reverse-engineering or unauthorised scraping of our AI data is strictly prohibited.</p>
            
            <h2>6. USAGE AND RIGHTS OF SUBMITTED CONTENT</h2>
            <p>You grant SanisTech Limited a perpetual, worldwide, non-exclusive, royalty-free license to process, reformat, and redistribute (in de-identified form) the content you submit to provide the Services.</p>
            
            <h2>7. COMPLIANCE, MODIFICATIONS, AND TERMINATION</h2>
            <p>The Company reserves the right to modify, enhance, or discontinue the Services at any time. We may terminate or suspend your access to the Services for violations of these Terms or extended account inactivity.</p>
            
            <h2>8. INTELLECTUAL PROPERTY OWNERSHIP</h2>
            <p>SanisTech HK Limited retains all rights, titles, and interests in and to the Services, including the AI logic, software, logos, and visual interfaces. These assets are protected under Hong Kong and international copyright and trademark laws.</p>
            
            <h2>9. ADVERTISEMENTS AND PROMOTIONS</h2>
            <p>The Services may be partially supported by advertising revenue or promotional content. The presence of third-party advertisements does not imply an endorsement or recommendation by the Company.</p>
            
            <h2>10. EXTERNAL LINKS AND INTEGRATIONS</h2>
            <p>The Services may include links to third-party websites. SanisTech HK Limited does not control these external sites and is not responsible for their availability, accuracy, or business practices.</p>
            
            <h2>11. FORCE MAJEURE</h2>
            <p>Neither party shall be held liable for any delays or failures in performance arising from causes beyond reasonable control, such as natural disasters, infrastructure failures, or civil unrest.</p>
            
            <h2>12. NOTICES AND COMMUNICATIONS</h2>
            <p>We may provide you with notifications through digital correspondence or platform updates. Continued use of the platform after such notices signifies your acceptance of any updated terms.</p>
            
            <h2>13. GENERAL INFORMATION</h2>
            <p>These Legal Terms constitute the complete and exclusive agreement between you and SanisTech HK Limited. These Terms shall be governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region.</p>

            <a href="/" className="back-home" style={{ display: 'inline-block', marginTop: '40px', fontWeight: 700, color: 'var(--teal)', textDecoration: 'underline' }}>Back to Homepage</a>
          </div>
        </div>
      </div>
      
      <style>{`
        .tc-container h1 { font-family: var(--font-heading); font-size: 48px; color: var(--navy); margin-bottom: 40px; }
        .tc-container h2 { font-family: var(--font-heading); font-size: 18px; color: var(--orange); margin: 40px 0 20px; text-transform: uppercase; letter-spacing: 1px; }
        .tc-container h3 { font-size: 18px; color: var(--navy); margin: 24px 0 12px; font-weight: 800; }
        .tc-container p { font-size: 15px; line-height: 1.8; color: var(--dark-gray); margin-bottom: 16px; }
        .tc-container ul { padding-left: 20px; margin-bottom: 24px; }
        .tc-container li { font-size: 15px; line-height: 1.8; color: var(--dark-gray); margin-bottom: 8px; }
      `}</style>
    </div>
  );
};

export default TC;
