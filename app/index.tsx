import {
  Background,
  Badge,
  Card,
  Icon,
  ProgressBar,
  ThemedText
} from "@/components/ui";
import { useCommitments } from "@/hooks/useCommitments";
import { theme } from "@/theme";
import { Commitment } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Svg, { Path } from 'react-native-svg';
// Helper function to calculate days left
const getDaysLeft = (endDate: string): number => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export default function Index() {
  const router = useRouter();
  const { data: commitments = [], isLoading, error } = useCommitments();

  return (
    <Background>
      <ScrollView style={styles.container}>

        {/* Active Commitments Section */}
        <View style={styles.sectionHeader}>
          <View>
            <ThemedText variant="xl" weight="bold">
              Active Commitments
            </ThemedText>
            <ThemedText variant="sm" color="secondary">
              Keep up the momentum
            </ThemedText>
          </View>
          <Pressable>
            <ThemedText variant="sm" color="primary" weight="semibold">
              View All →
            </ThemedText>
          </Pressable>
        </View>

        {/* Commitment Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.cardsContainer}
          contentContainerStyle={styles.cardsContentContainer}
        >
          {isLoading ? (
            <Card variant="elevated" style={styles.commitmentCard}>
              <ThemedText variant="base" align="center">
                Loading commitments...
              </ThemedText>
            </Card>
          ) : error ? (
            <Card variant="elevated" style={styles.commitmentCard}>
              <ThemedText variant="base" color="error" align="center">
                Failed to load commitments
              </ThemedText>
            </Card>
          ) : commitments.length === 0 ? (
            <Card variant="elevated" style={styles.commitmentCard}>
              <ThemedText variant="base" color="secondary" align="center">
                No active commitments
              </ThemedText>
            </Card>
          ) : (
            commitments.map((commitment: Commitment) => (
              <Pressable 
                key={commitment.id} 
                onPress={() => router.push(`/commitmentDetail?commitmentId=${commitment.id}`)}
              >
                <Card variant="elevated" style={styles.commitmentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardContent}>
                    <ThemedText variant="base" weight="semibold" numberOfLines={1}>
                      {commitment.activity}
                    </ThemedText>
                    <ThemedText variant="sm" color="secondary" numberOfLines={1} ellipsizeMode="tail">
                      {`${commitment.frequency} • ${commitment.duration}`}
                    </ThemedText>
                  </View>
                  <Badge variant="default" size="md">
                    ${commitment.stake}
                  </Badge>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <ThemedText variant="sm" color="secondary" weight="semibold">
                      Progress
                    </ThemedText>
                    <ThemedText variant="sm" weight="semibold">
                      {commitment.progress.completed}/{commitment.progress.total}
                    </ThemedText>
                  </View>
                  <ProgressBar 
                    value={(commitment.progress.completed / commitment.progress.total) * 100} 
                    variant="default" 
                    size="md" 
                    style={styles.progressBar}
                  />
                </View>

                <View style={styles.cardFooter}>
                  <Icon name="calendar-outline" size="sm" color="secondary" />
                  <ThemedText variant="sm" color="secondary" style={styles.footerText}>
                    {getDaysLeft(commitment.endDate)} days left
                  </ThemedText>
                  {commitment.bonus && (
                    <ThemedText variant="sm" color="success" weight="semibold">
                      +${commitment.bonus} bonus
                    </ThemedText>
                  )}
                </View>
                </Card>
              </Pressable>
            ))
          )}
        </ScrollView>

      </ScrollView>

      {/* Arrows and Text pointing to FAB */}
      <View style={styles.arrowContainer}>
        <ThemedText variant="xl" weight="extrabold" color="primary" align="center" style={styles.arrowText}>
          Create a Commitment!
        </ThemedText>
        
        {/* Left Arrow */}
        <View style={styles.leftArrow}>
          <Svg width="68" height="77" viewBox="0 0 68 77" style={styles.squigglyArrow}>
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M36.4058 21.9334L41.1332 16.3559C39.2314 17.9379 37.6704 19.8143 36.4058 21.9334ZM23.1688 30.9494C25.2167 29.029 27.1793 27.057 29.4146 25.3858C26.7801 26.6313 24.9064 28.7351 23.1688 30.9494ZM33.2576 34.8628C33.7854 35.8059 34.3218 35.3399 34.8298 34.9399C36.5485 33.5884 36.678 31.5876 36.7834 29.6735C36.8603 28.2784 36.7645 26.8185 36.0412 25.5301C35.7657 25.0387 35.412 24.7259 34.9817 25.4387C33.8074 27.3851 32.9252 29.4359 32.76 31.7319C32.6813 32.8257 32.8093 33.9015 33.2576 34.8628ZM30.044 26.4983C28.4758 27.3028 27.2555 28.5674 26.0094 29.7814C20.6252 35.0274 17.2489 41.4539 14.905 48.5197C13.3395 53.2397 12.2395 58.0626 11.3075 62.9339C11.2221 63.3783 11.1535 63.8311 10.8458 64.1895C10.4999 64.592 10.1735 64.7341 10.044 64.0384C10.0116 63.8672 10.1324 63.62 9.81447 63.6931C8.71764 63.9447 8.57833 63.1202 8.38728 62.4074C8.02827 61.0698 8.27652 59.7088 8.39131 58.3751C8.71242 54.6385 9.17526 50.9104 10.1232 47.2754C11.0034 43.9008 12.3627 40.6916 13.8111 37.5224C14.7331 35.505 15.6989 33.4657 17.2506 31.8988C18.2815 30.8578 18.8385 29.5395 19.8363 28.51C21.7493 26.5365 23.6757 24.5912 25.9913 23.0773C27.8973 21.8315 29.9825 21.148 32.2609 21.1387C33.0121 21.1359 33.5561 20.852 33.993 20.285C35.171 18.7574 36.4016 17.263 37.6421 15.7973C39.6599 13.4123 42.0469 11.3584 44.4974 9.40976C48.406 6.30179 52.5732 3.62757 57.3413 2.00582C60.1437 1.05265 62.9687 0.295021 65.9574 1.11102C66.7443 1.32581 67.4328 1.66676 67.8401 2.42598C68.016 2.75297 68.0549 3.05479 67.8179 3.37093C67.5375 3.74424 67.3526 3.49944 67.042 3.35738C64.9118 2.3824 62.9132 3.24742 60.9212 3.90867C55.4318 5.7307 50.8176 9.01166 46.4398 12.6746C43.0898 15.4778 40.0455 18.5808 37.3679 22.0365C37.1552 22.3109 36.7658 22.5228 37.3009 22.9146C39.1654 24.2792 40.116 26.2265 40.5107 28.4278C41.1203 31.8255 40.7845 35.0594 38.2512 37.6832C36.8901 39.0932 35.496 39.1912 33.7364 38.3538C29.2533 36.221 28.3904 31.6356 29.8533 27.7477C29.9848 27.3997 30.1159 27.0518 30.2468 26.7046C30.1792 26.6355 30.1114 26.567 30.044 26.4983Z"
              fill={theme.semantic.interactive.primary.default}
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.7396 69.066C11.1773 70.7696 9.87903 72.6455 8.96903 74.7731C10.2258 72.8709 11.4825 70.9684 12.7396 69.066ZM4.16018 63.3217C5.28587 65.375 6.04163 67.5845 6.8814 69.7589C7.00686 70.0839 6.98214 70.5315 7.50699 70.5757C8.01112 70.618 8.14131 70.2023 8.2923 69.9013C9.11672 68.2617 10.3763 66.9558 11.4775 65.5213C12.1728 64.6148 12.7024 63.5696 13.4452 62.6601C14.5892 61.2601 15.6297 59.7727 16.6756 58.2955C17.2058 57.547 18.0634 57.0791 18.326 56.0843C18.5838 55.1085 19.3593 54.91 20.7139 55.5058C21.4054 55.8096 21.9699 56.4212 21.6002 57.3018C21.2961 58.026 20.9306 58.7392 20.4918 59.389C17.5869 63.6895 14.6474 67.9665 11.7376 72.2636C11.0844 73.228 10.4955 74.2376 9.88906 75.2334C8.78653 77.0441 7.96815 77.2015 6.16577 76.0678C4.76664 75.1877 3.99186 73.9692 3.66283 72.3613C3.02909 69.2664 2.30718 66.1894 1.09654 63.2558C0.853796 62.668 0.528696 62.1149 0.262714 61.5357C-0.0458552 60.8654 0.158774 60.5306 0.921301 60.5897C2.61148 60.7196 2.87504 60.94 4.16018 63.3217Z"
              fill={theme.semantic.interactive.primary.default}
            />
          </Svg>
        </View>

        {/* Right Arrow (Mirrored) */}
        {/* <View style={styles.rightArrow}>
          <Svg width="68" height="77" viewBox="0 0 68 77" style={[styles.squigglyArrow, styles.mirroredArrow]}>
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M36.4058 21.9334L41.1332 16.3559C39.2314 17.9379 37.6704 19.8143 36.4058 21.9334ZM23.1688 30.9494C25.2167 29.029 27.1793 27.057 29.4146 25.3858C26.7801 26.6313 24.9064 28.7351 23.1688 30.9494ZM33.2576 34.8628C33.7854 35.8059 34.3218 35.3399 34.8298 34.9399C36.5485 33.5884 36.678 31.5876 36.7834 29.6735C36.8603 28.2784 36.7645 26.8185 36.0412 25.5301C35.7657 25.0387 35.412 24.7259 34.9817 25.4387C33.8074 27.3851 32.9252 29.4359 32.76 31.7319C32.6813 32.8257 32.8093 33.9015 33.2576 34.8628ZM30.044 26.4983C28.4758 27.3028 27.2555 28.5674 26.0094 29.7814C20.6252 35.0274 17.2489 41.4539 14.905 48.5197C13.3395 53.2397 12.2395 58.0626 11.3075 62.9339C11.2221 63.3783 11.1535 63.8311 10.8458 64.1895C10.4999 64.592 10.1735 64.7341 10.044 64.0384C10.0116 63.8672 10.1324 63.62 9.81447 63.6931C8.71764 63.9447 8.57833 63.1202 8.38728 62.4074C8.02827 61.0698 8.27652 59.7088 8.39131 58.3751C8.71242 54.6385 9.17526 50.9104 10.1232 47.2754C11.0034 43.9008 12.3627 40.6916 13.8111 37.5224C14.7331 35.505 15.6989 33.4657 17.2506 31.8988C18.2815 30.8578 18.8385 29.5395 19.8363 28.51C21.7493 26.5365 23.6757 24.5912 25.9913 23.0773C27.8973 21.8315 29.9825 21.148 32.2609 21.1387C33.0121 21.1359 33.5561 20.852 33.993 20.285C35.171 18.7574 36.4016 17.263 37.6421 15.7973C39.6599 13.4123 42.0469 11.3584 44.4974 9.40976C48.406 6.30179 52.5732 3.62757 57.3413 2.00582C60.1437 1.05265 62.9687 0.295021 65.9574 1.11102C66.7443 1.32581 67.4328 1.66676 67.8401 2.42598C68.016 2.75297 68.0549 3.05479 67.8179 3.37093C67.5375 3.74424 67.3526 3.49944 67.042 3.35738C64.9118 2.3824 62.9132 3.24742 60.9212 3.90867C55.4318 5.7307 50.8176 9.01166 46.4398 12.6746C43.0898 15.4778 40.0455 18.5808 37.3679 22.0365C37.1552 22.3109 36.7658 22.5228 37.3009 22.9146C39.1654 24.2792 40.116 26.2265 40.5107 28.4278C41.1203 31.8255 40.7845 35.0594 38.2512 37.6832C36.8901 39.0932 35.496 39.1912 33.7364 38.3538C29.2533 36.221 28.3904 31.6356 29.8533 27.7477C29.9848 27.3997 30.1159 27.0518 30.2468 26.7046C30.1792 26.6355 30.1114 26.567 30.044 26.4983Z"
              fill={theme.semantic.interactive.primary.default}
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.7396 69.066C11.1773 70.7696 9.87903 72.6455 8.96903 74.7731C10.2258 72.8709 11.4825 70.9684 12.7396 69.066ZM4.16018 63.3217C5.28587 65.375 6.04163 67.5845 6.8814 69.7589C7.00686 70.0839 6.98214 70.5315 7.50699 70.5757C8.01112 70.618 8.14131 70.2023 8.2923 69.9013C9.11672 68.2617 10.3763 66.9558 11.4775 65.5213C12.1728 64.6148 12.7024 63.5696 13.4452 62.6601C14.5892 61.2601 15.6297 59.7727 16.6756 58.2955C17.2058 57.547 18.0634 57.0791 18.326 56.0843C18.5838 55.1085 19.3593 54.91 20.7139 55.5058C21.4054 55.8096 21.9699 56.4212 21.6002 57.3018C21.2961 58.026 20.9306 58.7392 20.4918 59.389C17.5869 63.6895 14.6474 67.9665 11.7376 72.2636C11.0844 73.228 10.4955 74.2376 9.88906 75.2334C8.78653 77.0441 7.96815 77.2015 6.16577 76.0678C4.76664 75.1877 3.99186 73.9692 3.66283 72.3613C3.02909 69.2664 2.30718 66.1894 1.09654 63.2558C0.853796 62.668 0.528696 62.1149 0.262714 61.5357C-0.0458552 60.8654 0.158774 60.5306 0.921301 60.5897C2.61148 60.7196 2.87504 60.94 4.16018 63.3217Z"
              fill={theme.semantic.interactive.primary.default}
            />
          </Svg>
        </View> */}
      </View>

      {/* Floating Action Button - Centered */}
      <Pressable 
        style={styles.fab}
        onPress={() => router.push("/createCommitment")}
      >
        <Icon name="add" size="lg" color="inverse" />
      </Pressable>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing[5],
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing[8],
  },
  headerSubtitle: {
    marginTop: theme.spacing[1],
  },
  balanceCard: {
    marginBottom: theme.spacing[8],
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[5],
  },
  balanceInfo: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing[4],
  },
  primaryButton: {
    flex: 1,
  },
  outlineButton: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[5],
  },
  cardsContainer: {
    marginBottom: theme.spacing[8],
    paddingVertical: theme.spacing[2],
  },
  cardsContentContainer: {
    paddingHorizontal: theme.spacing[4],
  },
  commitmentCard: {
    marginRight: theme.spacing[4],
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[2],
    width: 280,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing[5],
  },
  cardContent: {
    flex: 1,
  },
  progressSection: {
    marginBottom: theme.spacing[5],
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[2],
  },
  progressBar: {
    marginTop: theme.spacing[2],
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  footerText: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing[8],
    left: '50%',
    marginLeft: -28, // Half of width to center
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.semantic.interactive.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 190, // Above the FAB
    left: '50%',
    marginLeft: -30, // Center the container
    width: 200,
    alignItems: 'center',
  },
  arrowText: {
    marginBottom: theme.spacing[3],
    color: theme.colors.primary[600],
    textShadowColor: 'rgba(2, 132, 199, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  leftArrow: {
    position: 'absolute',
    left: 30,
    top: 60,
    width: 50,
    height: 60,
    transform: [{ rotate: '0deg' }], // Tilt inward toward FAB
  },
  rightArrow: {
    position: 'absolute',
    right: 30,
    top: 40,
  },
  squigglyArrow: {
    // Perfect hand-drawn squiggly arrow!
  },
  mirroredArrow: {
    transform: [{ scaleX: -1 }], // Mirror horizontally
  },
});