import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, TextInput, TouchableOpacity, Modal, Platform } from 'react-native';

const ContactsApp = () => {
  const [contacts, setContacts] = useState([
    {
      title: 'Family',
      data: [
        { id: '1', name: 'Mom', number: '0101', group: 'Family' },
        { id: '2', name: 'Dad', number: '0102', group: 'Family' },
        { id: '3', name: 'Sister', number: '0103', group: 'Family' },
      ],
    },
    {
      title: 'Friends',
      data: [
        { id: '4', name: 'Ashir', number: '0201', group: 'Friends' },
        { id: '5', name: 'Ali', number: '0202', group: 'Friends' },
        { id: '6', name: 'Ahmed', number: '0203', group: 'Friends' },
      ],
    },
    {
      title: 'Work',
      data: [
        { id: '7', name: 'Manager', number: '0301', group: 'Work' },
        { id: '8', name: 'Colleague', number: '0302', group: 'Work' },
        { id: '10', name: 'HR', number: '0304', group: 'Work' },
      ],
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  
  const filteredContacts = contacts.map(section => ({
    ...section,
    data: section.data.filter(
      contact =>
        contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.number.includes(searchText)
    )
  })).filter(section => section.data.length > 0);

  const renderContactItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => {
        setSelectedContact(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactNumber}>{item.number}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or number"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <SectionList
        sections={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedContact && (
              <>
                <Text style={styles.modalTitle}>Contact Details</Text>
                <Text style={styles.modalText}>Name: {selectedContact.name}</Text>
                <Text style={styles.modalText}>Number: {selectedContact.number}</Text>
                <Text style={styles.modalText}>Group: {selectedContact.group}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  sectionHeader: {
    backgroundColor: '#6500ea',
    padding: 10,
  },
  sectionHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6200ee',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ContactsApp;