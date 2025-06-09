const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function addTeachers() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/feedback', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Sample teachers with complete information
        const teachers = [
            {
                username: 'john.smith',
                email: 'john.smith@university.edu',
                password: 'password123',
                role: 'teacher',
                firstName: 'John',
                lastName: 'Smith',
                department: 'Computer Science',
                isActive: true
            },
            {
                username: 'mary.johnson',
                email: 'mary.johnson@university.edu',
                password: 'password123',
                role: 'teacher',
                firstName: 'Mary',
                lastName: 'Johnson',
                department: 'Computer Science',
                isActive: true
            },
            {
                username: 'david.wilson',
                email: 'david.wilson@university.edu',
                password: 'password123',
                role: 'teacher',
                firstName: 'David',
                lastName: 'Wilson',
                department: 'Computer Science',
                isActive: true
            },
            {
                username: 'sarah.brown',
                email: 'sarah.brown@university.edu',
                password: 'password123',
                role: 'teacher',
                firstName: 'Sarah',
                lastName: 'Brown',
                department: 'Computer Science',
                isActive: true
            }
        ];

        // Hash passwords and create users
        for (const teacher of teachers) {
            const hashedPassword = await bcrypt.hash(teacher.password, 10);
            
            // Check if teacher already exists by email
            const existingTeacher = await User.findOne({ email: teacher.email });
            if (!existingTeacher) {
                await User.create({
                    ...teacher,
                    password: hashedPassword
                });
                console.log(`Created teacher: ${teacher.firstName} ${teacher.lastName}`);
            } else {
                console.log(`Teacher ${teacher.firstName} ${teacher.lastName} already exists`);
            }
        }

        console.log('All teachers added successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

addTeachers(); 