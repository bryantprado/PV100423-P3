const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test profiles data - expanded to 10 users with valid email addresses
const testProfiles = [
  {
    email: 'ana.garcia@testapp.com',
    password: 'testpass123',
    nombre: 'Ana García',
    descripcion: 'Desarrolladora Full Stack con 5 años de experiencia en React, Node.js y bases de datos SQL/NoSQL. Apasionada por crear soluciones web escalables y user-friendly.',
    habilidades: 'React, Node.js, TypeScript, PostgreSQL, MongoDB, AWS, Docker',
    experiencia: '5 años desarrollando aplicaciones web. He trabajado en startups y empresas establecidas, liderando equipos de desarrollo y arquitecturas de software.',
    tarifa_por_hora: 45,
    foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'carlos.rodriguez@testapp.com',
    password: 'testpass123',
    nombre: 'Carlos Rodríguez',
    descripcion: 'Diseñador UX/UI especializado en interfaces móviles y web. Experto en Figma, Adobe XD y prototipado rápido.',
    habilidades: 'Figma, Adobe XD, Sketch, Prototyping, User Research, Design Systems',
    experiencia: '4 años diseñando experiencias digitales. He colaborado con empresas de tecnología y startups para crear productos intuitivos y atractivos.',
    tarifa_por_hora: 40,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'maria.lopez@testapp.com',
    password: 'testpass123',
    nombre: 'María López',
    descripcion: 'Especialista en Marketing Digital y SEO. Experta en estrategias de contenido, redes sociales y análisis de datos.',
    habilidades: 'SEO, SEM, Google Analytics, Social Media Marketing, Content Strategy, Email Marketing',
    experiencia: '6 años en marketing digital. He ayudado a empresas a aumentar su presencia online y conversiones mediante estrategias data-driven.',
    tarifa_por_hora: 35,
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'david.martinez@testapp.com',
    password: 'testpass123',
    nombre: 'David Martínez',
    descripcion: 'Desarrollador Mobile con experiencia en React Native y Flutter. Especializado en apps iOS y Android de alta performance.',
    habilidades: 'React Native, Flutter, iOS, Android, Firebase, App Store Optimization',
    experiencia: '3 años desarrollando apps móviles. He publicado más de 10 apps en App Store y Google Play con miles de usuarios activos.',
    tarifa_por_hora: 50,
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'laura.hernandez@testapp.com',
    password: 'testpass123',
    nombre: 'Laura Hernández',
    descripcion: 'Data Scientist con experiencia en Machine Learning y análisis predictivo. Experta en Python, R y herramientas de BI.',
    habilidades: 'Python, R, Machine Learning, TensorFlow, Pandas, Tableau, Power BI',
    experiencia: '4 años analizando datos y creando modelos predictivos. He trabajado en proyectos de e-commerce, finanzas y salud.',
    tarifa_por_hora: 55,
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'javier.gonzalez@testapp.com',
    password: 'testpass123',
    nombre: 'Javier González',
    descripcion: 'DevOps Engineer especializado en AWS y Kubernetes. Experto en CI/CD, Docker y automatización de infraestructura.',
    habilidades: 'AWS, Kubernetes, Docker, Jenkins, Terraform, Linux, Monitoring',
    experiencia: '5 años en DevOps. He diseñado y mantenido infraestructuras cloud escalables para empresas de tecnología.',
    tarifa_por_hora: 60,
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'carmen.sanchez@testapp.com',
    password: 'testpass123',
    nombre: 'Carmen Sánchez',
    descripcion: 'Project Manager certificada PMP con experiencia en metodologías Agile y Scrum. Especializada en gestión de equipos remotos.',
    habilidades: 'Project Management, Agile, Scrum, Jira, Team Leadership, Risk Management',
    experiencia: '7 años gestionando proyectos tecnológicos. He liderado equipos multidisciplinarios en entornos ágiles y tradicionales.',
    tarifa_por_hora: 65,
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'roberto.jimenez@testapp.com',
    password: 'testpass123',
    nombre: 'Roberto Jiménez',
    descripcion: 'QA Engineer con experiencia en testing automatizado y manual. Experto en Selenium, Cypress y metodologías de testing.',
    habilidades: 'Selenium, Cypress, Jest, Testing, QA Automation, API Testing, Performance Testing',
    experiencia: '4 años en calidad de software. He implementado estrategias de testing que han mejorado la calidad del producto significativamente.',
    tarifa_por_hora: 42,
    foto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'sofia.ramirez@testapp.com',
    password: 'testpass123',
    nombre: 'Sofía Ramírez',
    descripcion: 'Desarrolladora Frontend especializada en Vue.js y Nuxt.js. Experta en diseño responsive y optimización de performance.',
    habilidades: 'Vue.js, Nuxt.js, JavaScript, CSS, HTML5, Webpack, Performance Optimization',
    experiencia: '3 años en desarrollo frontend. He creado interfaces de usuario para plataformas e-commerce y aplicaciones SaaS.',
    tarifa_por_hora: 38,
    foto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face'
  },
  {
    email: 'miguel.torres@testapp.com',
    password: 'testpass123',
    nombre: 'Miguel Torres',
    descripcion: 'Especialista en ciberseguridad y ethical hacking. Certificado CEH con experiencia en penetration testing y auditorías de seguridad.',
    habilidades: 'Cybersecurity, Ethical Hacking, Penetration Testing, Network Security, OWASP, SIEM',
    experiencia: '6 años en ciberseguridad. He realizado auditorías de seguridad para bancos y empresas tecnológicas, identificando vulnerabilidades críticas.',
    tarifa_por_hora: 70,
    foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face'
  }
];

async function seedProfiles() {
  console.log('🌱 Starting to seed test profiles with users...');

  try {
    console.log('👤 Creating test users and their profiles...');

    const createdUsers = [];
    const createdProfiles = [];

    for (let i = 0; i < testProfiles.length; i++) {
      const profileData = testProfiles[i];

      try {
        console.log(`\n📝 Creating user ${i + 1}: ${profileData.nombre}`);

        // Create user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: profileData.email,
          password: profileData.password,
        });

        if (authError) {
          console.warn(`⚠️  Could not create user ${profileData.nombre}: ${authError.message}`);
          continue;
        }

        if (!authData.user) {
          console.warn(`⚠️  No user data returned for ${profileData.nombre}`);
          continue;
        }

        createdUsers.push({
          email: profileData.email,
          userId: authData.user.id,
          nombre: profileData.nombre
        });

        console.log(`✅ Created user: ${profileData.email}`);

        // Create profile for the user
        const profileInsertData = {
          user_id: authData.user.id,
          nombre: profileData.nombre,
          descripcion: profileData.descripcion,
          habilidades: profileData.habilidades,
          experiencia: profileData.experiencia,
          tarifa_por_hora: profileData.tarifa_por_hora,
          foto: profileData.foto
        };

        const { data: profileDataResult, error: profileError } = await supabase
          .from('profiles')
          .insert(profileInsertData)
          .select()
          .single();

        if (profileError) {
          console.warn(`⚠️  Could not create profile for ${profileData.nombre}: ${profileError.message}`);
        } else {
          createdProfiles.push(profileDataResult);
          console.log(`✅ Created profile for: ${profileData.nombre}`);
        }

      } catch (err) {
        console.warn(`⚠️  Error processing ${profileData.nombre}: ${err.message}`);
      }
    }

    // Summary
    console.log('\n🎉 Seeding completed!');
    console.log(`📊 Created ${createdUsers.length} users and ${createdProfiles.length} profiles`);

    if (createdUsers.length > 0) {
      console.log('\n🔑 Test Accounts Created:');
      console.log('Password for all accounts: testpass123');
      console.log('=====================================');
      createdUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.nombre}`);
        console.log(`   📧 ${user.email}`);
        console.log(`   🔑 testpass123`);
        console.log('');
      });

      console.log('🚀 You can now login to TalentConnect with these accounts!');
      console.log('📱 Browse profiles in the Explore tab to see all the created talent.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the seed function
seedProfiles();